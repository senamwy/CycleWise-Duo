import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCIENTIFIC_STUDIES,
  HORMONE_PATHWAYS,
  SCIENTIFIC_MYTHBUSTERS,
  SCIENTIFIC_DOMAINS
} from '../data/scientificResearchData';
import { searchEuropePmc } from './europePmc';

test('SCIENTIFIC_STUDIES has comprehensive peer-reviewed data with valid citations and reading texts', () => {
  assert.ok(SCIENTIFIC_STUDIES.length >= 7, 'Must have at least 7 curated studies');
  
  for (const study of SCIENTIFIC_STUDIES) {
    assert.ok(study.id, 'Study must have id');
    assert.ok(study.title.length > 10, 'Study must have descriptive title');
    assert.ok(study.shortTitle.length > 5, 'Study must have short title');
    assert.ok(study.journal.length > 0, 'Study must cite a reputable journal');
    assert.ok(study.year >= 2000, 'Study must have valid year');
    assert.ok(study.keyFinding.length > 20, 'Study must explain key finding');
    assert.ok(study.biologicalMechanism.length > 20, 'Study must explain biological mechanism');
    assert.ok(study.practicalTakeaway.length > 20, 'Study must include practical partner takeaway');
    assert.ok(study.externalUrl.startsWith('https://'), 'Study must link to PubMed or official DOI');
    
    // Validate rich study reading structure
    if (study.fullAbstract) {
      assert.ok(study.fullAbstract.background.length > 20, `${study.id} must have abstract background`);
      assert.ok(study.fullAbstract.methods.length > 20, `${study.id} must have abstract methods`);
      assert.ok(study.fullAbstract.results.length > 20, `${study.id} must have abstract results`);
      assert.ok(study.fullAbstract.conclusions.length > 20, `${study.id} must have abstract conclusions`);
    }
    if (study.citationApa) {
      assert.ok(study.citationApa.includes(study.year.toString()), `${study.id} APA citation must contain year`);
    }
    if (study.figuresOrStats) {
      assert.ok(study.figuresOrStats.length > 0, `${study.id} must have stats figures`);
    }
  }
});

test('HORMONE_PATHWAYS covers the 4 critical cycle hormones with receptor targets', () => {
  assert.equal(HORMONE_PATHWAYS.length, 4, 'Must have 4 key hormone pathways');
  const ids = HORMONE_PATHWAYS.map((h) => h.id);
  assert.ok(ids.includes('estradiol'));
  assert.ok(ids.includes('progesterone'));
  assert.ok(ids.includes('luteinizing_hormone'));
  assert.ok(ids.includes('prostaglandin_f2a'));

  for (const hormone of HORMONE_PATHWAYS) {
    assert.ok(hormone.targetReceptors.length > 0, 'Must have target receptors specified');
    assert.ok(hormone.cycleBehavior.length > 10, 'Must describe cycle behavior');
    assert.ok(hormone.scientificFact.length > 10, 'Must include scientific fact');
  }
});

test('SCIENTIFIC_MYTHBUSTERS debunks common misconceptions with citations', () => {
  assert.ok(SCIENTIFIC_MYTHBUSTERS.length >= 5, 'Must have at least 5 scientific mythbusters');
  for (const myth of SCIENTIFIC_MYTHBUSTERS) {
    assert.ok(myth.myth.length > 10, 'Must state myth');
    assert.ok(myth.scientificFact.length > 10, 'Must state scientific fact');
    assert.ok(myth.studyCitation.length > 5, 'Must cite peer-reviewed study');
    assert.ok(myth.biologicalExplanation.length > 10, 'Must provide biological explanation');
  }
});

test('searchEuropePmc returns valid results for scientific queries', async () => {
  const result = await searchEuropePmc('dysmenorrhea');
  assert.ok(result.articles.length > 0, 'Should return articles');
  assert.ok(typeof result.totalHits === 'number', 'Total hits should be a number');
  assert.ok(result.articles[0].title.length > 0, 'First article must have title');
});
