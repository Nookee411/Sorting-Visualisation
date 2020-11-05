export function BubbleSorter(context) {
  this.sortArray = async function () {
    let array = context.getArray();
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (await context.compareAndDispatch(j, j + 1))
          await context.swapAndDispatch(j, j + 1);
      }
    }
  };
}
