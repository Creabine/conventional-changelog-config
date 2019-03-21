
> [conventional-changelog](https://github.com/ajoslin/conventional-changelog) [config](https://github.com/Creabine/conventional-changelog-config) preset


How to use:

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
    feat: 'Features 1',
    fix: 'Bug Fixes 2',
    perf: 'Performance Improvements 3',
    revert: 'Reverts 4',
    docs: 'Documentation 5',
    style: 'Styles 6',
    refactor: 'Code Refactoring 7',
    test: 'Tests 8',
    chore: 'Chores 9',
  },
  commitHashLength: 10
};

// package.json

"scripts": {
  "changelog": "conventional-changelog -p config -i CHANGELOG.md -s"
},


```
