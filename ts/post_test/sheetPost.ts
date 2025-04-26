class Sheet_POST {
    static async findSpreadSheetID(src_col_compare: any, src_col_get: any, row_count: number, src_spreadsheet_id: any, src_info_sheet_name: any, folder_id: any) {
        let range: any = computeRange_POST(src_col_compare, row_count);
        let table = await SheetAPI_POST.read(src_spreadsheet_id, src_info_sheet_name, range);
        
        let index = binarySearch_POST(table, UrlInfo_POST.courseId);
        if (!index.isFound) {
            if (UrlInfo_POST.courseId > table[index.index][0])
                ++index.index;
    
            const spreadsheet_id = await(SheetAPI_POST.createSpreadSheet(UrlInfo_POST.courseId, folder_id));
            await SheetAPI_POST.insertRow(src_spreadsheet_id, src_info_sheet_name, index.index + 1, ['', UrlInfo_POST.courseId, spreadsheet_id])
            
            return spreadsheet_id;
        }
        
        range = computeRange_POST(src_col_get, 1, src_col_get, index.index + 1)
        const result = await SheetAPI_POST.read(src_spreadsheet_id, src_info_sheet_name, range);
        return result[0][0]
    }

    static async createSheet(spreadsheet_id: any, sheet_name: any) {
        const is_created = await SheetAPI_POST.create(spreadsheet_id, sheet_name)
        if (is_created) {
            await this.initSheet(spreadsheet_id, sheet_name);
        }
    }

    static async initSheet(spreadsheet_id: any, sheet_name: any) {
        await SheetAPI_POST.insertRow(spreadsheet_id, sheet_name, 0, SubSheetInfo.column_names)
        
        let range = computeRange_POST(SubSheetInfo.COLUMNS.total, 1, SubSheetInfo.COLUMNS.total, 0);
        await SheetAPI_POST.writeFormula(spreadsheet_id, sheet_name, range, SubSheetInfo.total_formula);

        range = computeRange_POST(SubSheetInfo.BACKEND_COLUMNS.choice, 1, SubSheetInfo.BACKEND_COLUMNS.wrong_answer, 0);
        await SheetAPI_POST.write(spreadsheet_id, sheet_name, range, [SubSheetInfo.back_end_column_names]);

        await SheetAPI_POST.updateColSize(spreadsheet_id, sheet_name, SubSheetInfo.col_index_widths);
    }
}