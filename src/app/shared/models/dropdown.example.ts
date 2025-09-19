/**
 * Exemplo de uso do modelo DropDownItem
 * 
 * Para usar em outros componentes:
 * 
 * 1. Importe a interface:
 * import { DropDownItem } from '../../../shared/models/dropdown.model';
 * 
 * 2. Use em propriedades do componente:
 * export class MeuComponente {
 *   categorias: DropDownItem[] = [
 *     { id: '1', name: 'Categoria Principal' },
 *     { id: '2', name: 'Outra Categoria' }
 *   ];
 * 
 *   subcategorias: DropDownItem[] = [
 *     { id: '1', parentId: '1', name: 'Subcategoria 1' },
 *     { id: '2', parentId: '1', name: 'Subcategoria 2' },
 *     { id: '3', parentId: '2', name: 'Subcategoria 3' }
 *   ];
 * }
 * 
 * 3. Filtre subcategorias por parentId:
 * getSubcategoriasPorCategoria(categoriaId: string): DropDownItem[] {
 *   return this.subcategorias.filter(sub => sub.parentId === categoriaId);
 * }
 * 
 * 4. Use em templates HTML:
 * <select [(ngModel)]="categoriaSelecionada">
 *   <option *ngFor="let cat of categorias" [value]="cat.id">
 *     {{ cat.name }}
 *   </option>
 * </select>
 * 
 * <select [(ngModel)]="subcategoriaSelecionada">
 *   <option *ngFor="let sub of getSubcategoriasPorCategoria(categoriaSelecionada)" [value]="sub.id">
 *     {{ sub.name }}
 *   </option>
 * </select>
 */
