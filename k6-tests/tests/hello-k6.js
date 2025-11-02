import { browser } from "k6/browser";
import http from "k6/http";
import { check } from "k6";

/* export const options = {
  vus: 5,
  duration: "10s",
}

export default async () => {
  const user = {
    name: `User ${Math.random()}`
  };

  const url = "http://traefik:8000/users";
  const res = http.post(url, JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
  })

  check(res, {
    "status is 202": (r) => r.status === 202,
  })
} */

/* 
// test client performance
export const options = {
  scenarios: {
    client: {
      vus: 5,
      duration: "30s",
      executor: "constant-vus",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

export default async () => {
  const page = await browser.newPage();
  await page.goto("http://client:4321/");

  try {
    for (let i = 1; i < 5; i++) {
      await page.locator('//button[text()="Add item"]').click();
      await page.locator(`//li[text()="Item ${i}"]`).isVisible();
    }
  } finally {
    await page.close();
  }
}; */

export const options = {
  scenarios: {
    client: {
      vus: 5,
      duration: "20s",
      executor: "constant-vus",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

export default async () => {
  const page = await browser.newPage();
  await page.goto("http://traefik:8000/hybrid");

  try {
    await page.locator(`//li[text()="Item 999"]`).isVisible();
  } finally {
    await page.close();
  }
};