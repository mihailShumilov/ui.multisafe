import { action } from 'easy-peasy';

export const mountMultisafe = action((state, payload) => {
  const { localMultisafe, contract, balance, members } = payload;
  state.general.name = localMultisafe.name;
  state.general.multisafeId = localMultisafe.multisafeId;
  state.general.balance = balance.available;

  state.members = members.map(({ account_id }) => ({ accountId: account_id }));
  state.entities.contract = contract;
});
