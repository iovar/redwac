SRC_DIR = src

run: 
	cd $(SRC_DIR); deno run --allow-run --allow-read --allow-write --allow-net --unstable cmd/compile.ts

test:
	deno test $(SRC_DIR)/app/main_test.ts 

fmt:
	deno fmt $(SRC_DIR)/app $(SRC_DIR)/cmd
