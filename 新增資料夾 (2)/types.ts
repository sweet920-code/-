export enum RecordType {
  SCRAP = 'SCRAP',
  DEFECT = 'DEFECT'
}

export enum Location {
  RUI_JI_INTERNAL = '瑞吉內場',
  XIMEN_INTERNAL = '西門內場',
  XIMEN_EXTERNAL = '西門外場',
  GUANGMING_EXTERNAL = '光明外場'
}

export enum ScrapCategory {
  A = 'A→成品報廢 (烤焦、破損、過期、外觀不良)',
  B = 'B→半成品報廢 (發酵、攪拌、保存等)',
  C = 'C→原料報廢 (過期、誤用、汙染、異味)',
  D = 'D→包裝報廢 (印刷錯誤、封膜不良)',
  E = 'E→外場報廢 (展示超期、客人退貨、操作失誤)'
}

export enum DefectCategory {
  OPERATION = '作業疏失',
  RECORD = '紀錄違反',
  EQUIPMENT = '設備問題',
  QUALITY = '品質異常',
  OTHER = '其他'
}

export interface BaseRecord {
  id: string;
  date: string;
  location: Location;
  timestamp: number;
}

export interface ScrapRecord extends BaseRecord {
  type: RecordType.SCRAP;
  category: ScrapCategory;
  details: string; // Product, Quantity, Person
  reason: string;
  imageUrl?: string;
}

export interface DefectRecord extends BaseRecord {
  type: RecordType.DEFECT;
  category: DefectCategory;
  otherCategoryDetails?: string;
  causeAndPerson: string;
  correctiveAction: string;
}

export type AppRecord = ScrapRecord | DefectRecord;

export type ViewState = 'DASHBOARD' | 'SELECT_TYPE' | 'FORM_SCRAP' | 'FORM_DEFECT' | 'SUCCESS' | 'LOGIN' | 'ADMIN_VIEW';
