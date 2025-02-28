
import { Page } from '@playwright/test';

import test from '@lib/BaseTest';

import testData from '../../Environment_variables/staging/onBoardingTestData.json' assert { type: 'json' };


test.describe('ClearFeed Ticket Tests', () => {
    let CFPage: Page;
    let SlckPage: Page;

    test(
        'Verify Creation of CF ticket from slack through Emoji and Automatic ticketing',
        { tag: '@Smoke' },
        async ({ newWorkspacePage, onboardingPage }) => {
            test.setTimeout(400000); // Set timeout to 400000 seconds for this test
            await test.step('Navigate to existing Slack workspace', async () => {
                await newWorkspacePage.loginToSlack(testData.existingUserEmail, testData.existingDomainName, testData.existingInboxName, testData.existingTokenKey);
                //  SlckPage = await newWorkspacePage.navigateToSlackWorkspace()
                //await newWorkspacePage.navigateSlackWorkspace();
                // await newWorkspacePage.againNavigateToCF();

                // await onboardingPage.verifySettingConfiguration(CFPage)
                // await onboardingPage.navigateBack(CFPage);
                // await newWorkspacePage.verifyTikcet(SlckPage);
                // await newWorkspacePage.verifyCommentsFromWebAppToSlack(SlckPage)
            });
            await test.step('Navigate to existing ClearFeed application Using Magic link', async () => {
                CFPage = await onboardingPage.navigateToClearFeedApplictaion();
                await onboardingPage.loginToClearFeedWithMagicLink(CFPage, testData.existingUserEmail, testData.existingDomainName, testData.existingInboxName, testData.existingTokenKey);
                await onboardingPage.verifyCollections(CFPage);
                await onboardingPage.verifySettingConfiguration(CFPage, 2)
                await onboardingPage.navigateBack(CFPage);
                await newWorkspacePage.verifyTikcet1(SlckPage);
                await newWorkspacePage.verifyCommentsFromWebAppToSlack1()
                await newWorkspacePage.againNavigateToCF();


                await onboardingPage.verifyCommentsFromSlckToWebApp(CFPage);
                await onboardingPage.verifySettingConfiguration(CFPage, 1)
                await onboardingPage.navigateBack(CFPage);
                await newWorkspacePage.verifyTikcet1(SlckPage)
                await newWorkspacePage.addEmoji1();
                await newWorkspacePage.againNavigateToCF();
                await onboardingPage.verifyCommentsFromSlckToWebApp(CFPage);

            });
        },
    );

    // test.afterEach(async ({ page, context, onBoardingPagePagePage }) => {
    //     let accountId: string | null = null;
    //     if (CFPage) {
    //         await CFPage.reload();
    //         accountId = await CFPage.evaluate(() => {
    //             return window.localStorage.getItem('accountId');
    //         });
    //     }
    //     console.log('Account ID:', accountId);
    //     if (accountId) {
    //         console.log('Deleting account with ID:', accountId);
    //         await onBoardingPagePagePage.deleteAccountAPI(accountId, page, context);
    //         console.log('Account with ID', accountId, 'has been deleted.');
    //     } else {
    //         console.log('No accountId found, skipping user deletion.');
    //     }
    // });
});


