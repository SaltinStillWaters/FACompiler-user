class Sheet {
    static async findSpreadSheetID(src_col_compare: any, src_col_get: any, row_count: number, src_spreadsheet_id: any, src_info_sheet_name: any, folder_id: any) {
        let range: any = computeRange(src_col_compare, row_count);
        let table = await SheetAPI.read(src_spreadsheet_id, src_info_sheet_name, range);
        
        let index = binarySearch(table, UrlInfo.courseId);
        if (!index.isFound) {
            if (UrlInfo.courseId > table[index.index][0])
                ++index.index;
    
            const spreadsheet_id = await(SheetAPI.createSpreadSheet(UrlInfo.courseId, folder_id));
            await SheetAPI.insertRow(src_spreadsheet_id, src_info_sheet_name, index.index + 1, ['', UrlInfo.courseId, spreadsheet_id])
            
            return spreadsheet_id;
        }
        
        range = computeRange(src_col_get, 1, src_col_get, index.index + 1)
        const result = await SheetAPI.read(src_spreadsheet_id, src_info_sheet_name, range);
        return result[0][0]
    }

    static async createSheet(spreadsheet_id: any, sheet_name: any) {
        const is_created = await SheetAPI.create(spreadsheet_id, sheet_name)
        console.log('is created: ', is_created);
        if (is_created) {
            await this.initSheet(spreadsheet_id, sheet_name);
        }
    }

    static async initSheet(spreadsheet_id: any, sheet_name: any) {
        await SheetAPI.insertRow(spreadsheet_id, sheet_name, 0, SubSheetInfo.column_names)
        console.log('done insert row');
        
        await SheetAPI.writeFormula(spreadsheet_id, sheet_name, SubSheetInfo.COLUMNS.total, SubSheetInfo.total_formula);
        console.log('done write formula');

        let range = computeRange(SubSheetInfo.BACKEND_COLUMNS.question_id, 1, SubSheetInfo.BACKEND_COLUMNS.wrong_answer, 0);
        console.log(range);
        await SheetAPI.write(spreadsheet_id, sheet_name, range, [SubSheetInfo.back_end_column_names]);

        await SheetAPI.updateColSize(spreadsheet_id, sheet_name, SubSheetInfo.col_index_widths);
        
        console.log('done init');
    }
}