import { normalizeTitle, findReleaseNote } from './extracting';

describe('extraction tools', () => {
  describe('normalizeTitle', () => {
    it('should remove versions in brackets', () => {
      expect(normalizeTitle('[7.12] With a pr title [8.12.0] or at the end [10.2]')).toBe(
        'With a pr title or at the end'
      );
    });

    it('should remove linked issue numbers', () => {
      expect(normalizeTitle('Add a new feature (#7213)')).toBe('Add a new feature');
      expect(normalizeTitle('#123 fixing bug')).toBe('Fixing bug');
    });

    it('should remove trailing/leading non word characters', () => {
      expect(normalizeTitle(' - Fix something: ')).toBe('Fix something');
    });

    it('should strip all bracket content', () => {
      expect(normalizeTitle('[ML] Some machine learning', { bracketHandling: 'strip' })).toBe(
        'Some machine learning'
      );
      // strip should also be the default setting
      expect(normalizeTitle('[ML] Some machine learning')).toBe('Some machine learning');
    });

    it('should keep bracket content when configured', () => {
      expect(normalizeTitle('[ML] Some machine learning', { bracketHandling: 'keep' })).toBe(
        '[ML] Some machine learning'
      );
    });

    it('should capitalize the first letter', () => {
      expect(normalizeTitle('adds a new feature')).toBe('Adds a new feature');
    });
  });

  describe('findReleaseNotes', () => {
    it('should extract in paragraph release notes', () => {
      expect(
        findReleaseNote(`
        # Title

        Release Notes: This is the extracted sentence.

        Next paragraph
      `)
      ).toBe('This is the extracted sentence.');
    });

    it('should extract the full paragraph', () => {
      expect(
        findReleaseNote(`
# Title

Release Notes: This release note details is spanning
multiple lines, but all should be extracted.

Next paragraph
      `)
      ).toBe('This release note details is spanning\nmultiple lines, but all should be extracted.');
    });

    it('should extract different variations of the label release notes', () => {
      expect(findReleaseNote('Release Notes: This is the extracted sentence.')).toBe(
        'This is the extracted sentence.'
      );
      expect(findReleaseNote('Release-Notes: This is the extracted sentence.')).toBe(
        'This is the extracted sentence.'
      );
      expect(findReleaseNote('release notes: This is the extracted sentence.')).toBe(
        'This is the extracted sentence.'
      );
      expect(findReleaseNote('Release Note: This is the extracted sentence.')).toBe(
        'This is the extracted sentence.'
      );
      expect(findReleaseNote('Release Notes - This is the extracted sentence.')).toBe(
        'This is the extracted sentence.'
      );
    });
  });
});