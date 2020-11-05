export function SelectionSorter(context) {
  let array;
  this.sortArray = async function () {
    array = context.getArray();
    for (let i = 0; i < array.length; i++) {
      let res = await findMaxValue(i);

      await context.swapAndDispatch(i, res);
    }
  };
  let findMaxValue = async function (startIndex) {
    let maxIndex = startIndex;
    for (let i = startIndex; i < array.length; i++) {
      if (await context.compareAndDispatch(i, maxIndex)) {
        maxIndex = i;
      }
    }
    return maxIndex;
  };
}
