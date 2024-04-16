import moment from 'jalali-moment'

import { Draft } from '../models/draft.model';


const createHamlSortObject = (sort: any) => {
  const {
    weight: weightSort,
    code: codeSort,
    yekta: yektaSort,
    hamlCode: hamlCodeSort,
    bargah: bargahSort,
    shenaseh: shenasehSort
  } = sort;

  return {
    ...(weightSort && { weight: weightSort }),
    ...(codeSort && { code: codeSort }),
    ...(yektaSort && { yekta: yektaSort }),
    ...(hamlCodeSort && { hamlCode: hamlCodeSort }),
    ...(bargahSort && { bargah: bargahSort }),
    ...(shenasehSort && { shenaseh: shenasehSort })
  };
};


const formatDate: (date: string) => { miladi: string; mongo: string } = (date: string) => {
  return {
    miladi: moment.from(date, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD'),
    mongo: moment.from(date, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-M-D HH:mm:ss'),
  }
}

const createDraftInstance = (draftData: any) => {
  const calculatedDate = (['9', '8', '7', '6'].includes(draftData.tarekh[0]) ? '13' : '14') + draftData.tarekh;
  const mongoDate = new Date(moment.from(calculatedDate, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-M-D HH:mm:ss'));

  return new Draft({
    ...draftData,
    date: mongoDate,
    status: draftData.status ?? -1,
  });
};




export {
  createDraftInstance,
  createHamlSortObject,
  formatDate,
}
