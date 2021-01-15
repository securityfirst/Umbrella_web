const CronJob = require("cron").CronJob;
const fs = require("fs");
const git = require("simple-git");

class GithubContent {
  constructor() {
    this.directory = appRoot + "/static/assets/content";
    this.exists = fs.existsSync(appRoot + "/static/assets/content");
  }

  clone() {
    console.log("[CRON] GITHUB_CONTENT: Cloning content repository...");

    git(
      appRoot
    ).clone(
      `https://github.com/${process.env.GITHUB_CONTENT_REPO}.git`,
      this.directory,
      () => console.log("[CRON] GITHUB_CONTENT: Finished.")
    );
  }

  pull() {
    console.log("[CRON] GITHUB_CONTENT: Pulling from master branch...");

    git(this.directory).pull("origin", "master", null, () =>
      console.log("[CRON] GITHUB_CONTENT: Updated.")
    );
  }

  start() {
    // Clone before job
    if (!this.exists) this.clone();

    // Every hour = 0 0 0/1 1/1 * * *
    const job = new CronJob("0 0 0/1 1/1 * * *", () => {
      console.log("[CRON] GITHUB_CONTENT: Starting job at", new Date());

      if (!this.exists) this.clone();
      else this.pull();
    });

    job.start();

    console.log("[CRON] Initialized GitHub content job");

    return job;
  }
}

module.exports = new GithubContent();
