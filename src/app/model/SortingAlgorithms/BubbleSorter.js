export function BubbleSorter() {
  this.sortArray = async function () {
    let array = this.getArray();
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (await this.compareAndDispatch(j, j + 1))
          await this.swapAndDispatch(j, j + 1);
      }
    }
    console.log(array);
  };
}
