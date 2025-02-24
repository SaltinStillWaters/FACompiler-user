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
            
            await this.initSpreadSheet(spreadsheet_id);
            return spreadsheet_id;
        }
        
        range = computeRange(src_col_get, 1, src_col_get, index.index + 1)
        const result = await SheetAPI.read(src_spreadsheet_id, src_info_sheet_name, range);
        return result[0][0]
    }

    static async initSpreadSheet(spreadsheet_id: any) {
        await SheetAPI.insertRow(spreadsheet_id, SubSheetInfo.info_sheet_name, 0, SubSheetInfo.column_names)
        console.log('done insert row');
        
        let range = computeRange(SubSheetInfo.COLUMNS.total, 1, SubSheetInfo.COLUMNS.total, 0);
        await SheetAPI.writeFormula(spreadsheet_id, SubSheetInfo.info_sheet_name, range, SubSheetInfo.total_formula);
        console.log('done write formula');

        range = computeRange(SubSheetInfo.BACKEND_COLUMNS.choice, 1, SubSheetInfo.BACKEND_COLUMNS.wrong_answer, 0);
        await SheetAPI.write(spreadsheet_id, SubSheetInfo.info_sheet_name, range, [SubSheetInfo.back_end_column_names]);

        await SheetAPI.updateColSize(spreadsheet_id, SubSheetInfo.info_sheet_name, SubSheetInfo.col_index_widths);
        
        console.log('done init');
    }
}