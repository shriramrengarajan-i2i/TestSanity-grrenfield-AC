import { resolveLogLevels } from './configuration';

describe('resolveLogLevels', () => {
  it('includes the given level and all more severe levels', () => {
    expect(resolveLogLevels('warn')).toEqual(['warn', 'error', 'fatal']);
  });

  it('includes everything for the most verbose level', () => {
    expect(resolveLogLevels('verbose')).toEqual(['verbose', 'debug', 'log', 'warn', 'error', 'fatal']);
  });

  it('includes only the level itself and more severe ones for the default', () => {
    expect(resolveLogLevels('log')).toEqual(['log', 'warn', 'error', 'fatal']);
  });

  it('falls back to the default level for an unrecognized value', () => {
    expect(resolveLogLevels('not-a-level')).toEqual(['log', 'warn', 'error', 'fatal']);
  });
});
