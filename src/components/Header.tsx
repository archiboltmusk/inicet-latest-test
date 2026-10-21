import React from 'react';

interface HeaderProps {
  currentRoute: string;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute }) => {
  const isRouteActive = (route: string) => {
    if (route === 'today' && (currentRoute === 'today' || !currentRoute)) return true;
    if (route === 'matrix' && (currentRoute === 'matrix' || currentRoute === 'c')) return true;
    return currentRoute === route;
  };

  return (
    <header className="top">
      <a className="brand" href="#/today">
        INI-CET <b>Revision OS</b>
      </a>
      <nav id="nav">
        <a href="#/today" className={isRouteActive('today') ? 'on' : ''}>
          Today
        </a>
        <a href="#/sprint" className={isRouteActive('sprint') ? 'on' : ''}>
          Sprint
        </a>
        <a href="#/matrix" className={isRouteActive('matrix') ? 'on' : ''}>
          Matrix
        </a>
        <a href="#/block" className={isRouteActive('block') ? 'on' : ''}>
          Block
        </a>
        <a href="#/review" className={isRouteActive('review') ? 'on' : ''}>
          Review
        </a>
        <a href="#/errors" className={isRouteActive('errors') ? 'on' : ''}>
          Error OS
        </a>
        <a href="#/spotters" className={isRouteActive('spotters') ? 'on' : ''}>
          Spotters
        </a>
        <a href="#/notebook" className={isRouteActive('notebook') ? 'on' : ''}>
          Notebook
        </a>
        <a href="#/pyq" className={isRouteActive('pyq') ? 'on' : ''}>
          PYQs
        </a>
        <a href="#/coverage" className={isRouteActive('coverage') ? 'on' : ''}>
          Coverage
        </a>
        <a href="#/playbook" className={isRouteActive('playbook') ? 'on' : ''}>
          Playbook
        </a>
        <a href="#/discriminators" className={isRouteActive('discriminators') ? 'on' : ''} title="Confusable Pairs Discriminator">
          Pairs
        </a>
        <a href="#/volatile" className={isRouteActive('volatile') ? 'on' : ''} title="20 Easy-Mark Volatile Revision Sheets">
          20 Sheets
        </a>
        <a href="quest/" title="8-bit organ-system tracker">
          Quest
        </a>
        <a
          href="#/settings"
          className={isRouteActive('settings') ? 'on' : ''}
          aria-label="Settings"
        >
          ⚙
        </a>
      </nav>
    </header>
  );
};
