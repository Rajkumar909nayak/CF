import { randomInt } from 'crypto';

import { BrowserContext } from '@playwright/test';
import type { Page } from '@playwright/test';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import qaTestData from '../Environment_variables/staging/onBoardingTestData.json';

const testData = qaTestData;

const MAILINATOR_HEADERS = {
  accept: 'application/json',
};

export class WebActions {
  private messageID: string;
  readonly page: Page;
  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  /**
   * Method for decrypt password
   * @param password
   * @returns
   */
  async decipherPassword(password: string): Promise<string> {
    const key = 'SECRET';
    return CryptoJS.AES.decrypt(password, key).toString(CryptoJS.enc.Utf8);
  }

  /**
   * Method for decrypt token
   * @returns
   */
  async decipherToken(): Promise<string> {
    const key = 'SECRET';
    const bytes = CryptoJS.AES.decrypt(testData.token, key);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
  }

  /**
   * Method to generate random string
   * @param length
   * @returns
   */
  async generateRandomString(length: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % charactersLength;
      result += characters[randomIndex];
    }
    return result;
  }

  /**
   * Method to generate random number
   * @param min
   * @param max
   * @returns
   */
  async getCryptoRandomNumber(min: number, max: number): Promise<number> {
    return randomInt(min, max + 1);
  }

  /**
   * Method to build Mailinator API URL
   * @param endpoint - The API endpoint
   * @returns string - The complete API URL
   */
  private buildMailinatorUrl(domain: string, inbox: string, endpoint: string, token: string): string {
    const { mailinatorBaseURL } = qaTestData;

    if (!mailinatorBaseURL) {
      throw new Error('Missing required Mailinator configuration');
    }

    return `${mailinatorBaseURL}/v2/domains/${domain}/inboxes/${inbox}${endpoint}?token=${token}`;
  }

  /**
   * Method to extract message id
   */
  async fetchMessageId(domain: string, inbox: string, token: string) {
    const response = await axios.get(this.buildMailinatorUrl(domain, inbox, '/', token), {
      headers: MAILINATOR_HEADERS,
    });
    this.messageID = response.data.msgs[0].id;
  }

  /**
   * Mathod to extract OTP
   * @returns
   */
  async fetchOTP(domain: string, inbox: string, token: string) {
    const response = await axios.get(
      this.buildMailinatorUrl(domain, inbox, `/messages/${this.messageID}/`, token),
      {
        headers: MAILINATOR_HEADERS,
      },
    );
    const subject = response.data.subject;
    const parts = subject.split(' ');
    const otp = parts[parts.length - 1];
    return otp;
  }

  /**
   * Method to extract link from inbox
   * @returns
   */
  async fetchMagicLink(domain: string, inbox: string, token: string) {
    await this.fetchMessageId(domain, inbox, token);
    const response = await axios.get(
      this.buildMailinatorUrl(domain, inbox, `/messages/${this.messageID}/links/`, token),
      {
        headers: MAILINATOR_HEADERS,
      },
    );
    const magicLink = response.data.links[0];
    return magicLink;
  }
}
