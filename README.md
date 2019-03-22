
> [conventional-changelog](https://github.com/ajoslin/conventional-changelog) [config](https://github.com/Creabine/conventional-changelog-config) preset

How to use:

```
npm install conventional-changelog

npm install conventional-changelog-config

touch changelog.config.js

// changelog.config.js

'use strict';

module.exports = {
  link: {
    host: 'http://gitlab.xxxxx.net',
    owner: 'creabine',
    repository: 'repository',
  },
  typeTitle: {
    feat: 'Features',
    fix: 'Bug Fixes',
    perf: 'Performance Improvements',
    revert: 'Reverts',
    docs: 'Documentation',
    style: 'Styles',
    refactor: 'Code Refactoring',
    test: 'Tests',
    chore: 'Chores',
  },
  commitHashLength: 10
};

// package.json

"scripts": {
  "changelog": "conventional-changelog -p config -i CHANGELOG.md -s"
}

npm run changelog

```
