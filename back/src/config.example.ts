import { ConfigType } from './types/config.type.js';

export const config: ConfigType = {
    autoSendScreenshots: false,
    moreCadnumsLoadCount: 10,
    countCadnumsBeforeLoadMore: 3,
    countDownloadedBeforeSendToMainServer: 5,
    cadnumsWhereRegex: null,
    // cadnumsWhereRegex: '^77:01:',
    waitForWssClient: false,
    viewportParams: {
        width: 800,
        height: 2200,
    },
    fullRestartIntervalMinutes: 60,
    waitBetweenCadnumsSecs: 10,
    attemptTimeoutSecs: 30,
    waitBetweenAttemptsSecs: 5,
    maxAttemptsBeforeFailure: 15,
    onFailureWaitMinutes: 10,
};
