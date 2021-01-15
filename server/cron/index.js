const githubContentJob = require("./githubContent");
const githubLocaleJob = require("./githubLocale");

class Cron {
  constructor() {
    this.jobsRunning = new Map();
  }

  start() {
    this.jobsRunning.set("github_content", githubContentJob.start());
    this.jobsRunning.set("github_locale", githubLocaleJob.start());
  }

  stop() {
    this.jobsRunning.forEach((job) => job.stop());
    this.jobsRunning.clear();
  }
}

module.exports = new Cron();
