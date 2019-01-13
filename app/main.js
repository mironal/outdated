const carlo = require("carlo")
const { exec } = require("child_process")
const { promisify } = require("util")
const os = require("os")
const path = require("path")

const execp = promisify(exec)
const home = os.homedir()

const resolveHomedir = input => {
	if (typeof input !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof input}`);
	}

	return home ? input.replace(/^~(?=$|\/|\\)/, home) : input;
}

/**
 * @param {string} command 
 * @param {import "child_process".ExecOptions} opt 
 */
const runCommand = async (command, opt) => {
  if (opt && opt.cwd) {
    opt.cwd = resolveHomedir(opt.cwd)
  }
  console.log(new Date().toString(), "run command:", `'${command}'`, "with", opt)
  return await execp(command, opt)
}

;(async () => {
  // Launch the browser.
  const app = await carlo.launch({
    userDataDir: path.join(os.homedir(), "mironal.outdated")
  })

  // Terminate Node.js process on app window closing.
  app.on("exit", () => process.exit())

  app.serveOrigin("http://localhost:3000")
  await app.exposeFunction("runCommand", runCommand)
  // Tell carlo where your web files are located.
  // app.serveFolder(path.join(dirname, "../", "www", "build"))

  // Navigate to the main page of your app.
  await app.load("http://localhost:3000/index.html")
})()
