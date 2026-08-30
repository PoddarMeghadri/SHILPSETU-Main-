import { LanguageCode } from '../../types';
import { en } from './en';
import { hi } from './hi';
import { bn, as, or, mai, mni, sat, brx } from './eastern';
import { ta, te, kn, ml } from './southern';
import { mr, gu, pa, doi, ks, kok, ne, sa, sd, ur } from './western_northern';

export const ALL_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en,
  hi,
  as,
  bn,
  brx,
  doi,
  gu,
  kn,
  ks,
  kok,
  mai,
  ml,
  mni,
  mr,
  ne,
  or,
  pa,
  sa,
  sat,
  sd,
  ta,
  te,
  ur,
};
