.DEFAULT_GOAL := build

# Build
.PHONY: build
build: clean dist tsc copy

# Removing the actual dist directory confuses git and will require a git worktree prune to fix
,PHONY: clean
clean:
	rm -rf dist/*

# Add worktree for gh-pages branch
dist:
	git stash && \
	git checkout --orphan=gh-pages && \
	git reset && \
	git commit --allow-empty -m "Initial commit" && \
	git switch -f main && \
	git worktree add dist gh-pages

# Copy files from src to dist excluding *.ts
.PHONY: copy
copy: dist
	cd src && \
	find ! -name '*.ts' -type f -exec cp --parents {} ../dist \;

# Build typescript
.PHONY: tsc
tsc: dist
	tsc --project tsconfig.prod.json

# Deploy to github page
.PHONY: deploy
deploy: build
	cd dist && \
	git add --all && \
	git commit -m "Deploy to gh-pages" && \
	git push origin gh-pages
