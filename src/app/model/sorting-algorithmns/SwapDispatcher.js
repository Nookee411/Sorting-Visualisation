export function swapAndDispatch(arrayContext, firstIndex, secondIndex) {
  [.array[firstIndex], this.array[secondIndex]] = [
    this.array[secondIndex],
    this.array[firstIndex],
  ];
  this.dispatch(SortEvent.ItemSwapped, { index: secondIndex });
}
