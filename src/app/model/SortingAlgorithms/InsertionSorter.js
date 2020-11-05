export function InsertionSorter(context) {
  this.sortArray = async function () {
    let array = context.getArray();
    //Taking each element to the left until it starts to fit comparer

    for (let i = 1; i < array.length; i++) {
      let indexOfEle = i;
      while (
        indexOfEle > 0 &&
        !(await context.compareAndDispatch(indexOfEle, indexOfEle - 1))
      ) {
        await context.swapAndDispatch(indexOfEle - 1, indexOfEle);
        indexOfEle--;
      }
    }
  };
}
