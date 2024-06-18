// TODO это выпилить скорее всего, т.к. если уж грузить что
//      то через интерфейс, то надо общий для всех парсеров
export const useMsudrfSudDeloStore = defineStore('msudrf-sud-delo', () => {

    const itemsToImport = ref<{
        fio: string
        status: 'new' | 'failed' | 'success'
    }[]>([]);

    const addItemsToImport = (text: string) => {
        setTimeout(() => {
            const parsedItems = text
                .split('\n')
                .map(value => value.trim())
                .filter(value => value.length > 0);
            for (let i = 0; i < parsedItems.length; i++) {
                const exists = itemsToImport.value.find(x => x.fio === parsedItems[i]);
                if (!exists) {
                    itemsToImport.value.push({
                        fio: parsedItems[i],
                        status: 'new',
                    });
                } else {
                    // console.log(`Already exists: ${parsedItems[i]}`);
                }
            }
        }, 100);
        // console.log({ result });
    };

    return { itemsToImport, addItemsToImport };
}, {
    persist: true,
});
