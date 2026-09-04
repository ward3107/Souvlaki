import type { LocalizedString, BadgeKey } from '../../utils/menuData';
import { type MenuItemRecord } from '../../utils/menuStore';
import { emptyLoc } from './constants';

export interface DraftDish {
  id?: string;
  category: string;
  name: LocalizedString;
  description: LocalizedString;
  price: string;
  image_url: string | null;
  badges: BadgeKey[];
  available: boolean;
}

export function recordToDraft(r: MenuItemRecord): DraftDish {
  return {
    id: r.id,
    category: r.category,
    name: { ...emptyLoc(), ...r.name },
    description: { ...emptyLoc(), ...(r.description ?? {}) },
    price: String(r.price),
    image_url: r.image_url,
    badges: r.badges ?? [],
    available: r.available,
  };
}
