export function InsertionSorter() {
  this.sortArray = async function () {
    console.log("1");
    let array = this.getArray();
    //Taking each element to the left until it starts to fit comparer

    for (let i = 1; i < array.length; i++) {
      let indexOfEle = i;
      while (
        indexOfEle > 0 &&
        (await this.compareAndDispatch(indexOfEle, indexOfEle - 1))
      ) {
        await this.swapAndDispatch(indexOfEle - 1, indexOfEle);
        indexOfEle--;
      }
    }
  };
}
