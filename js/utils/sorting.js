/**
 * Sorting Algorithms Implementation
 * Provides multiple sorting algorithms for different use cases
 */

class SortingAlgorithms {
    /**
     * Quick Sort Implementation (Divide and Conquer)
     * Time Complexity: O(n log n) average, O(n²) worst case
     * Space Complexity: O(log n)
     * Efficient for large datasets, in-place sorting
     */
    static quickSort(arr, compareFn, left = 0, right = arr.length - 1) {
        if (left < right) {
            const pivotIndex = this.partition(arr, compareFn, left, right);
            this.quickSort(arr, compareFn, left, pivotIndex - 1);
            this.quickSort(arr, compareFn, pivotIndex + 1, right);
        }
        return arr;
    }

    /**
     * Partition function for Quick Sort
     * Selects pivot and partitions array around it
     */
    static partition(arr, compareFn, left, right) {
        const pivot = arr[right]; // Choose last element as pivot
        let i = left - 1;

        for (let j = left; j < right; j++) {
            if (compareFn(arr[j], pivot) <= 0) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
            }
        }

        [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
        return i + 1;
    }

    /**
     * Merge Sort Implementation (Divide and Conquer)
     * Time Complexity: O(n log n) guaranteed
     * Space Complexity: O(n)
     * Stable sort, good for linked lists and large datasets
     */
    static mergeSort(arr, compareFn) {
        if (arr.length <= 1) {
            return arr;
        }

        const mid = Math.floor(arr.length / 2);
        const left = this.mergeSort(arr.slice(0, mid), compareFn);
        const right = this.mergeSort(arr.slice(mid), compareFn);

        return this.merge(left, right, compareFn);
    }

    /**
     * Merge function for Merge Sort
     * Combines two sorted arrays into one sorted array
     */
    static merge(left, right, compareFn) {
        const result = [];
        let i = 0;
        let j = 0;

        while (i < left.length && j < right.length) {
            if (compareFn(left[i], right[j]) <= 0) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }

        return result.concat(left.slice(i)).concat(right.slice(j));
    }

    // Comparison functions for different sorting criteria
    
    static compareByPriceAsc(a, b) {
        return a.price - b.price;
    }

    static compareByPriceDesc(a, b) {
        return b.price - a.price;
    }

    static compareByName(a, b) {
        return a.name.localeCompare(b.name);
    }

    static compareByCategory(a, b) {
        return a.category.localeCompare(b.category);
    }
}

/**
 * Sort products using custom sorting algorithms
 */
function sortProducts(products, sortBy) {
    const productsCopy = [...products];
    
    switch(sortBy) {
        case 'price-low':
            return SortingAlgorithms.quickSort(productsCopy, SortingAlgorithms.compareByPriceAsc);
        case 'price-high':
            return SortingAlgorithms.quickSort(productsCopy, SortingAlgorithms.compareByPriceDesc);
        case 'name':
            return SortingAlgorithms.mergeSort(productsCopy, SortingAlgorithms.compareByName);
        case 'category':
            return SortingAlgorithms.mergeSort(productsCopy, SortingAlgorithms.compareByCategory);
        default:
            return productsCopy;
    }
}