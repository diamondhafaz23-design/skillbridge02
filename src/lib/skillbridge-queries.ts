import { queryOptions } from '@tanstack/react-query';
import { getAccount, getDirectory } from './skillbridge.functions';
export const directoryOptions = queryOptions({ queryKey: ['directory'], queryFn: () => getDirectory(), staleTime: 60_000 });
export const accountOptions = (userId: string | undefined) => queryOptions({ queryKey: ['account', userId], queryFn: () => getAccount(), enabled: Boolean(userId), retry: false, staleTime: 30_000 });