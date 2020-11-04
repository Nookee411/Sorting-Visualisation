export function SelectionSorter() {
  let array;
  this.sortArray = async function () {
    array = this.getArray();
    for (let i = 0; i < array.length; i++) {
      let res = await findMaxValue.call(this, i);

      await this.swapAndDispatch(i, res);
    }
  };
  let findMaxValue = async function (startIndex) {
    let maxIndex = startIndex;
    for (let i = startIndex; i < array.length; i++) {
      if (await this.compareAndDispatch(i, maxIndex)) {
        maxIndex = i;
      }
    }
    return maxIndex;
  };
}
