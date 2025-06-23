import { BadWordFilter } from "../plugins/badwordfilter.plugin";
export const filter = new BadWordFilter();
filter.loadBadword();
