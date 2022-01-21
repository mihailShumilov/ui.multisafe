import { thunk } from 'easy-peasy';
import { getDataBeforeRenderPage } from '../helpers/getDataBeforeRenderPage';
import { getNearEntities } from '../helpers/getNearEntities';
import { getIndexerConnection } from './getIndexerConnection';
import { isRedirect } from './isRedirect';
import { manageNavigation } from './manageNavigation';
import { handleRedirectFromWallet } from './handleRedirectFromWallet/handleRedirectFromWallet';

export const onInitApp = thunk(async (_, payload, { getStoreState, getStoreActions }) => {
  const { history, setInit } = payload;

  const actions = getStoreActions();
  const initApp = actions.general.initApp;

  const [nearEntities, indexerConnection] = await Promise.all([
    getNearEntities(getStoreState),
    getIndexerConnection(),
  ]);

  initApp({ nearEntities, indexerConnection });

  const state = getStoreState();

  // All redirect from NEAR Wallet leads to /redirect-from-wallet route. If it is the case,
  // handle it and redirect the user to the appropriate page. If not - check if a user has access
  // to the page and redirect to the proper page
  if (isRedirect(state, history)) {
    await handleRedirectFromWallet(state, actions, history);
  } else {
    manageNavigation(state, history);
  }

  // Call onMount thunk for the page - we want to load data before the page will be mounted -
  // it allows us to avoid "screen blinking" or display the empty page to the user.
  await getDataBeforeRenderPage({ actions, history, withLoading: false });

  // Finish initialization and hide loader
  setInit(true);
});
