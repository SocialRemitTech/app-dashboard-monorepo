// .lintstagedrc.cjs
// `--no-error-on-unmatched-pattern` and `--ignore-unknown` stop the hook exploding when a
// staged path is a DELETION (nothing on disk to lint/format) — which is what blocked the
// restore commit.
module.exports = {
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix --no-error-on-unmatched-pattern',
    'prettier --write --ignore-unknown',
  ],
  '*.{json,md,yml,yaml}': ['prettier --write --ignore-unknown'],
};
