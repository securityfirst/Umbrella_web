const CronJob = require("cron").CronJob;
const fs = require("fs");
const YAML = require("yaml");
const MT = require("mark-twain");

class GithubLocale {
  constructor() {
    this.contentDirectory = appRoot + "/static/assets/content/";
    this.localeDirectory = appRoot + "/static/assets/locale/";
    this.existsContent = fs.existsSync(this.contentDirectory);
    this.existsLocale = fs.existsSync(this.localeDirectory);
    this.existsFileLocale = fs.existsSync(
      this.localeDirectory + "github-locale.json"
    );
  }

  async run(done) {
    console.log("[CRON] GITHUB_LOCALE: Generating map...");

    try {
      // For each locale key, cat + subcat = flat tree, no nesting
      let map = {};

      const res = await fetch(`${process.env.ROOT}/api/github/tree`);
      const content = await res.json();

      // Loop through each locale...
      Object.keys(content).forEach((locale) => {
        const localeDir = this.contentDirectory + locale + "/";

        let localeMap = {};

        // Set up categories...
        Object.keys(content[locale]).forEach(async (category) => {
          if (category === "content") return;

          if (fs.existsSync(localeDir + `${category}/.category.yml`)) {
            const yml = fs.readFileSync(
              localeDir + `${category}/.category.yml`,
              "utf8"
            );
            const data = YAML.parse(yml);

            if (!localeMap[category]) localeMap[category] = data.title;
          }

          if (category === "glossary") {
            content[locale].glossary.content
              .filter((lesson) => lesson.filename.substr(0, 2) === "s_")
              .forEach(async (lesson) => {
                try {
                  if (
                    !fs.existsSync(localeDir + `${category}/${lesson.filename}`)
                  )
                    return;

                  const mdBlob = fs.readFileSync(
                    localeDir + `${category}/${lesson.filename}`
                  );
                  if (!mdBlob) return;

                  const stringVal = mdBlob.toString();
                  if (!stringVal) return;

                  const jsonML = MT(stringVal);
                  if (!jsonML || !jsonML.meta || !jsonML.meta.title) return;

                  localeMap[lesson.sha] = jsonML.meta.title;
                } catch (e) {
                  console.error(
                    `[CRON] GITHUB_LOCALE: Error parsing ${locale} ${lesson.filename}`,
                    e
                  );
                  localeMap[lesson.sha] = lesson.filename
                    .slice(2)
                    .replace(/\.md/, "")
                    .replace(/-/g, " ");
                }
              });
          } else {
            // Set up subcategories...
            Object.keys(content[locale][category])
              .filter((sub) => sub != "content")
              .forEach(async (subcategory) => {
                if (
                  fs.existsSync(
                    localeDir + `${category}/${subcategory}/.category.yml`
                  )
                ) {
                  const yml = fs.readFileSync(
                    localeDir + `${category}/${subcategory}/.category.yml`,
                    "utf8"
                  );
                  const data = YAML.parse(yml);

                  if (!localeMap[subcategory])
                    localeMap[subcategory] = data.title;
                }

                const levels = Object.keys(
                  content[locale][category][subcategory]
                );

                if (levels.length === 1 && levels[0] === "content") {
                  content[locale][category][subcategory].content
                    .filter((lesson) => lesson.filename.substr(0, 2) === "s_")
                    .forEach(async (lesson) => {
                      try {
                        if (
                          !fs.existsSync(
                            localeDir +
                              `${category}/${subcategory}/${lesson.filename}`
                          )
                        )
                          return;

                        const mdBlob = fs.readFileSync(
                          localeDir +
                            `${category}/${subcategory}/${lesson.filename}`
                        );
                        if (!mdBlob) return;

                        const stringVal = mdBlob.toString();
                        if (!stringVal) return;

                        const jsonML = MT(stringVal);
                        if (!jsonML || !jsonML.meta || !jsonML.meta.title)
                          return;

                        localeMap[lesson.sha] = jsonML.meta.title;
                      } catch (e) {
                        console.error(
                          `[CRON] GITHUB_LOCALE: Error parsing ${locale} ${lesson.filename}`,
                          e
                        );
                        localeMap[lesson.sha] = lesson.filename
                          .slice(2)
                          .replace(/\.md/, "")
                          .replace(/-/g, " ");
                      }
                    });
                } else {
                  // Set up levels
                  Object.keys(content[locale][category][subcategory])
                    .filter((level) => level != "content")
                    .forEach(async (level) => {
                      if (
                        fs.existsSync(
                          localeDir +
                            `${category}/${subcategory}/${level}/.category.yml`
                        )
                      ) {
                        const yml = fs.readFileSync(
                          localeDir +
                            `${category}/${subcategory}/${level}/.category.yml`,
                          "utf8"
                        );
                        const data = YAML.parse(yml);

                        if (!localeMap[level]) localeMap[level] = data.title;
                      }

                      // Set up cards
                      content[locale][category][subcategory][level].content
                        .filter(
                          (lesson) => lesson.filename.substr(0, 2) === "s_"
                        )
                        .forEach(async (lesson) => {
                          try {
                            if (
                              !fs.existsSync(
                                localeDir +
                                  `${category}/${subcategory}/${level}/${lesson.filename}`
                              )
                            )
                              return;

                            const mdBlob = fs.readFileSync(
                              localeDir +
                                `${category}/${subcategory}/${level}/${lesson.filename}`
                            );
                            if (!mdBlob) return;

                            const stringVal = mdBlob.toString();
                            if (!stringVal) return;

                            const jsonML = MT(stringVal);
                            if (!jsonML || !jsonML.meta || !jsonML.meta.title)
                              return;

                            localeMap[lesson.sha] = jsonML.meta.title;
                          } catch (e) {
                            console.error(
                              `[CRON] GITHUB_LOCALE: Error parsing ${locale} ${lesson.filename}`,
                              e
                            );
                            localeMap[lesson.sha] = lesson.filename
                              .slice(2)
                              .replace(/\.md/, "")
                              .replace(/-/g, " ");
                          }
                        });
                    });
                }
              });
          }
        });

        map[locale] = localeMap;
      });

      const json = JSON.stringify(map);

      const success = fs.writeFileSync(
        this.localeDirectory + "github-locale.json",
        json,
        "utf8"
      );

      console.log("[CRON] GITHUB_LOCALE: Finished.");
    } catch (e) {
      console.error(e);
    }
  }

  start() {
    if (!this.existsLocale) fs.mkdirSync(this.localeDirectory);
    if (!this.existsFileLocale) this.run();

    // Every hour = 0 0 0/1 1/1 * * *
    const job = new CronJob("0 0 0/1 1/1 * * *", () => {
      console.log("[CRON] GITHUB_LOCALE: Starting job at", new Date());

      // If repo hasn't been downloaded yet, skip
      if (!this.existsContent) return;
      else this.run();
    });

    job.start();

    console.log("[CRON] Initialized GitHub locale job");

    return job;
  }
}

module.exports = new GithubLocale();
