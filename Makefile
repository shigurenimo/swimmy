.PHONY: build

check:
	@bun tsc --noEmit

format:
	@bun biome format . --fix --unsafe

kill:
	@lsof -ti:3000 | xargs kill -9

claude:
	@claude --dangerously-skip-permissions
