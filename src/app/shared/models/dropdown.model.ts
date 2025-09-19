/**
 * Interfaces compartilhadas para dropdowns e seleções
 */

export interface DropDownItem {
  id: string;
  name: string;
  parentId?: string | null;
}
