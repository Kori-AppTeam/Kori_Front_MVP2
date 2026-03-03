import { LinkedSpace } from '../../linked-space/list/types';

export interface ProfileLinkedSpace {
  items: LinkedSpace[];
  hasNext: boolean;
  nextCursor: number | null;
}
