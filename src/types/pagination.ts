export interface PageInfo {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }
  
  export interface PaginationLinks {
    self: {
      href: string;
    };
  }
  
  export interface PaginatedResponse<T> {
    _embedded: {
      [key: string]: T[];
    };
    _links: PaginationLinks;
    page: PageInfo;
  }
  
  export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
  }
  
  // Helper type to extract the embedded array type from a paginated response
  export type ExtractEmbeddedArray<T> = T extends PaginatedResponse<infer U> ? U[] : never;