import React, { useState } from 'react';
import { User, PersonalReminder, ReminderCategory } from '../types';
import {
  getReminders,
  addReminder,
  updateReminder,
  deleteReminder
} from '../utils/storage';
import { formatDateGerman, filterAndSortReminders } from '../utils/helpers';
import {
  Bell,
  Plus,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  Repeat,
  Trash2,
  Edit2,
  X,
  Heart,
  Home as HomeIcon,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';

interface RemindersViewProps {
  user: User;
  isAddModalOpen?: boolean;
  prefillTitle?: string;
  prefillCategory?: ReminderCategory;
  onCloseAddModal?: () => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  user,
  isAddModalOpen = false,
  prefillTitle = '',
  prefillCategory = 'gesture',
  onCloseAddModal
}) => {
  const [reminders, setRemindersState] = useState<PersonalReminder[]>(() => getReminders(user.id));
  const [filter, setFilter] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [showModal, setShowModal] = useState(isAddModalOpen);
  const [editingReminder, setEditingReminder] = useState<PersonalReminder | null>(null);

  // Form State
  const [title, setTitle] = useState(prefillTitle || '');
  const [category, setCategory] = useState<ReminderCategory>(prefillCategory || 'gesture');
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [dueTime, setDueTime] = useState<string>('18:00');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [notes, setNotes] = useState('');

  // Handle external modal trigger from prefill
  React.useEffect(() => {
    if (isAddModalOpen) {
      setTitle(prefillTitle);
      if (prefillCategory) setCategory(prefillCategory);
      setShowModal(true);
    }
  }, [isAddModalOpen, prefillTitle, prefillCategory]);

  const categories: { id: ReminderCategory; label: string }[] = [
    { id: 'gesture', label: 'Kleine Gesten' },
    { id: 'date', label: 'Date-Ideen' },
    { id: 'occasion', label: 'Wichtige Anlässe' },
    { id: 'household', label: 'Haushalt & Entlastung' },
    { id: 'goals', label: 'Beziehungsziele' },
    { id: 'personal', label: 'Persönlich' }
  ];

  const handleToggleComplete = (rem: PersonalReminder) => {
    const updated = { ...rem, isCompleted: !rem.isCompleted };
    updateReminder(user.id, updated);
    setRemindersState(getReminders(user.id));
  };

  const handleDelete = (id: string) => {
    deleteReminder(user.id, id);
    setRemindersState(getReminders(user.id));
  };

  const openEditModal = (rem: PersonalReminder) => {
    setEditingReminder(rem);
    setTitle(rem.title);
    setCategory(rem.category);
    setDueDate(rem.dueDate);
    setDueTime(rem.dueTime || '');
    setRecurring(rem.recurring);
    setNotes(rem.notes || '');
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingReminder(null);
    setTitle('');
    setCategory('gesture');
    setDueDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setDueTime('18:00');
    setRecurring('none');
    setNotes('');
    setShowModal(true);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const categoryObj = categories.find((c) => c.id === category);
    const categoryLabel = categoryObj ? categoryObj.label : 'Allgemein';

    if (editingReminder) {
      updateReminder(user.id, {
        ...editingReminder,
        title: title.trim(),
        category,
        categoryLabel,
        dueDate,
        dueTime: dueTime || undefined,
        recurring,
        notes: notes.trim() || undefined
      });
    } else {
      addReminder(user.id, {
        title: title.trim(),
        category,
        categoryLabel,
        dueDate,
        dueTime: dueTime || undefined,
        recurring,
        notes: notes.trim() || undefined,
        isCompleted: false
      });
    }

    setRemindersState(getReminders(user.id));
    setShowModal(false);
    setEditingReminder(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  // Filtered and sorted reminders
  const sorted = filterAndSortReminders(reminders, filter);
  const displayedReminders = sorted.filter((rem) => {
    if (selectedCategory === 'all') return true;
    return rem.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 tracking-wide uppercase">
            <span>Aufmerksam bleiben</span>
            <span aria-hidden="true">·</span>
            <span>Persönliches System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Deine Erinnerungen
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Vergiss nie wieder bedeutsame Anlässe, kleine Aufmerksamkeiten oder Zusagen.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Erinnerung anlegen</span>
        </button>
      </div>

      {/* Filter Tabs & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-[#1A1A26] p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              filter === 'upcoming'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Anstehend ({reminders.filter((r) => !r.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Erledigt ({reminders.filter((r) => r.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Alle ({reminders.length})
          </button>
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#1A1A26] border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
          >
            <option value="all">Alle Kategorien</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reminder List */}
      <div className="space-y-3">
        {displayedReminders.length === 0 ? (
          <div className="p-10 rounded-3xl bg-[#1A1A26] border border-slate-800 text-center">
            <Bell className="w-10 h-10 text-purple-400/60 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Keine Erinnerungen in dieser Ansicht</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Trage Dates, Anlässe oder kleine Taten ein, an die du rechtzeitig erinnert werden möchtest.
            </p>
            <button
              onClick={openNewModal}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Neue Erinnerung anlegen
            </button>
          </div>
        ) : (
          displayedReminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                rem.isCompleted
                  ? 'bg-[#14141E] border-slate-800/60 opacity-60'
                  : 'bg-[#1A1A26] border-slate-800 hover:border-purple-500/40 shadow-lg'
              }`}
            >
              <button
                onClick={() => handleToggleComplete(rem)}
                className="mt-1 text-slate-500 hover:text-purple-400 transition-colors cursor-pointer shrink-0"
                aria-label={rem.isCompleted ? 'Als unerledigt markieren' : 'Als erledigt markieren'}
              >
                {rem.isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-sm sm:text-base font-bold truncate ${
                      rem.isCompleted ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {rem.title}
                  </h3>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(rem)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg transition-colors cursor-pointer"
                      title="Bearbeiten"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(rem.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                      title="Löschen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {rem.notes && (
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {rem.notes}
                  </p>
                )}

                {/* Metadata tags */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-purple-300 font-medium">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateGerman(rem.dueDate)}</span>
                  </span>

                  {rem.dueTime && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{rem.dueTime} Uhr</span>
                      </span>
                    </>
                  )}

                  <span aria-hidden="true">·</span>
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded-md text-slate-300 text-[10px]">
                    {rem.categoryLabel}
                  </span>

                  {rem.recurring !== 'none' && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-pink-300">
                        <Repeat className="w-3 h-3" />
                        <span className="capitalize">{rem.recurring}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT REMINDER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-7 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-400" />
                {editingReminder ? 'Erinnerung bearbeiten' : 'Neue Erinnerung'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (onCloseAddModal) onCloseAddModal();
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Titel der Erinnerung *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Blumen mitbringen oder Wärmflasche machen"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs sm:text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kategorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReminderCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Datum *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Uhrzeit <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Wiederholung
                </label>
                <select
                  value={recurring}
                  onChange={(e) => setRecurring(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                >
                  <option value="none">Keine Wiederholung (Einmalig)</option>
                  <option value="daily">Täglich</option>
                  <option value="weekly">Wöchentlich</option>
                  <option value="monthly">Monatlich</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Persönliche Notizen <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Details, Lieblingssorte, genauer Ort..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101018] border border-slate-700 text-xs sm:text-sm text-white focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    if (onCloseAddModal) onCloseAddModal();
                  }}
                  className="w-1/3 py-2.5 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !dueDate}
                  className="w-2/3 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  {editingReminder ? 'Aktualisieren' : 'Erinnerung speichern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
