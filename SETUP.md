# Setup and migration notes

Clone with `git clone https://github.com/fholstege/fholstege.github.io.git`. GitHub Pages builds the published site from the `master` branch. The repository has no pinned local Jekyll environment, so remote Pages rendering is currently the authoritative reconstruction path.

The checked-in static source needs no Python or Node dependency installation. A cheap local source preview is:

```bash
python3 -m http.server 8000
```

For a reproducible Jekyll build, add a reviewed `Gemfile` matching the GitHub Pages toolchain, then run `bundle install` and `bundle exec jekyll serve`.

No external datasets or models are required by the published site. The `_site/` output, `local/`, and `illustrations/` are intentionally ignored. Preserve any irreplaceable source inside ignored folders separately; generated site output and virtual environments should not be committed.
