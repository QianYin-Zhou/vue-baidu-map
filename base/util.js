import { createPoint } from './factory'

export const isPoint = obj => obj.lng && obj.lat

export const checkType = val => Object.prototype.toString.call(val).slice(8, -1)

export const getPosition = (BMap, point) => isPoint(point) ? createPoint(BMap, point) : point

export const generateOptions = (obj) => {
  return deleteEmptyKey(obj);
}

const deleteEmptyKey = (obj) => {
  let copyObj = { ...obj }
  Object.keys(copyObj).forEach(key => {
    if (typeof copyObj[key] === 'undefined') {
      delete copyObj[key];
    }
  });
  return copyObj;
}