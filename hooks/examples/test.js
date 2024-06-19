const webdriver = require("selenium-webdriver");
const By = webdriver.By;
var moment = require("moment");
var waitTime = 2 // 2 seconds
const fs = require('fs');

// username: Username can be found at automation dashboard
const USERNAME = process.env.LT_USERNAME || "ritikvyaparapp";

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LT_ACCESS_KEY || "yDyYFFY9yX5X7PLHmj4GEGvWtLGWJf4wTYBHtA67Svyv1YzhMb";


const GRID_HOST = process.env.GRID_HOST || "@hub.lambdatest.com/wd/hub";    //connect to lambdatest hub


async function searchTextOnGoogle() {
  var keys = process.argv;
  console.log(keys);
  let parallelCount = keys[2] || 1;
  let tunnel = keys[3] || false;
  let platform = keys[4] || "monterey";
  let browserName = keys[5] || "chrome";
  let version = keys[6] || "latest";
  // let platform = keys[4] || "android";
  // let browserName = keys[5] || "safari";
  // let version = keys[6] || "latest";

  // Setup Input capabilities
  const capabilities = {
    platform: platform,
    platformName: platform,

    browserName: browserName,
    "LT:Options": {
  
    version: version,
    queueTimeout: 300,
    visual: true,
    "user": USERNAME,
    "resolution": "1920x1080",
    "accessKey": KEY,
    name: "test session-2", // name of the test
    build: platform + browserName + version, // name of the build
    "smartUI.project": "Vyapar_Home_Page",
    "selenium_version": "4.0.0",
    idleTimeout: 300,
    // "w3c": true,
  }
};

  //add github app capabilities
  let githubURL = process.env.GITHUB_URL
  if (githubURL) {
    capabilities.github = {
      url: githubURL
    }
  }

  if (tunnel === "true") {
    capabilities.tunnel = true;
  }

  var gridUrl = "https://" + USERNAME + ":" + KEY + GRID_HOST;
  console.log(gridUrl);
  console.log(USERNAME);
  console.log(capabilities);
  console.log("Running " + parallelCount + " parallel tests ");
  let i = 1;
  for (i = 1; i <= parallelCount; i++) {
    startTest(gridUrl, capabilities, "Test " + i);
  }
}
searchTextOnGoogle();

async function startTest(gridUrl, capabilities, name) {
  const caps = capabilities;
  var start_date = moment();

  const driver = await new webdriver.Builder()
    .usingServer(gridUrl)
    .withCapabilities(caps)
    .build();

  var end_date = moment();
  var duration = moment.duration(end_date.diff(start_date));
  console.log(caps.name, " : Setup Time :", duration.asSeconds());

  // navigate to a url
  // let url = "https://theobjective.com/espana/?google_preview=G2G9GPtavZgY_PW0rAYw_JHqswaIAYCAgODltu_TvAE&iu=470376764&gdfp_req=1&lineItemId=6393136539&creativeId=138452601793";
  let url = "https://vyaparapp.in";
  // let url = "https://www.lambdatest.com/visual-regression-testing";
  console.log(url);
  try {
    await driver.get(url);
    let obj = {
      screenshotName: 'lambdatest1',
      fullPage: true,
      // selectDOM: {
      //   xpath: ['/html/body/main/section/div[2]/div[1]/div[2]/div[1]/div/div', '/html/body/div[2]/visualmarket-mini-market//section/main'] // Ignoring elements by XPath
      // },
    };
    // const response = await driver.executeScript("smartui.takeScreenshot", obj);
    let title = await driver.getTitle();
    setTimeout(async function () {
      try {
        const response = await driver.executeScript("smartui.takeScreenshot", obj);
        waitTime = 5;

        console.log(response);
        driver.quit();

        // Set the status to passed after taking the screenshot
        await driver.executeScript("lambda-status=passed");
      } catch (error) {
        // Log any errors that occur
        console.error("Failed to take screenshot:", error);

        // Optionally, set a different status on failure
        await driver.executeScript("lambda-status=failed");
      }
    }, 15000);
    url = "https://vyaparapp.in";
    await driver.get(url);
    obj = {
      screenshotName: 'lambdatest2',
      fullPage: true,
      // selectDOM: {
      //   xpath: ['/html/body/main/section/div[2]/div[1]/div[2]/div[1]/div/div', '/html/body/div[2]/visualmarket-mini-market//section/main'] // Ignoring elements by XPath
      // },
    };
    setTimeout(async function () {
      try {
        const response = await driver.executeScript("smartui.takeScreenshot", obj);
        waitTime = 5;

        console.log(response);
        driver.quit();

        // Set the status to passed after taking the screenshot
        await driver.executeScript("lambda-status=passed");
      } catch (error) {
        // Log any errors that occur
        console.error("Failed to take screenshot:", error);

        // Optionally, set a different status on failure
        await driver.executeScript("lambda-status=failed");
      }
    }, 15000);

  } catch (err) {
    console.log("test failed with reason", err);
    await driver.executeScript("lambda-status=failed");
    driver.quit();
  }

}