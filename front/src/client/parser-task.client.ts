import { ClientBase } from '~/client/client-base.js';
import type { ParserTaskType } from '~/shared/schemas/parser-task/read.js';

type ParserTaskGetAllResponseType = {
    success: true,
    items: ParserTaskType[],
    total: number,
} | {
    success: false,
    err: any,
}

export class ParserTaskClient extends ClientBase {

    async getMany(
        limit: number,
        offset: number,
    ): Promise<ParserTaskGetAllResponseType> {
        try {
            const response = await this.request.get(
                `parser-tasks?limit=${limit}&offset=${offset}`,
            );
            if (response.status === 200) {
                return {
                    success: true,
                    items: response.data.items,
                    total: response.data.total,
                };
            } else {
                return {
                    success: false,
                    err: response,
                };
            }
        } catch (err) {
            return {
                success: false,
                err,
            };
        }
    }

    // async create(
    //     parserName: ParserNameType,
    //     inputData: GenericDictionary,
    // ): Promise<ParserRunResponseType> {
    //     try {
    //         const response = await this.request.post('parser-task', {
    //             parserName,
    //             inputData,
    //         });
    //         // console.log(response);
    //         if (response.status === 200) {
    //             return {
    //                 success: true,
    //                 data: response.data,
    //             };
    //         } else {
    //             // console.log(response);
    //             return {
    //                 success: false,
    //                 err: response,
    //             };
    //         }
    //     } catch (err) {
    //         return {
    //             success: false,
    //             err,
    //         };
    //     }
    // }
}
