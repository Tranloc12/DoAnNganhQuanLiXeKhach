import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  size = "md",
  className = "" 
}) => {
  if (totalPages <= 1) return null;

  const items = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  if (startPage > 0) {
    items.push(
      <BootstrapPagination.First 
        key="first" 
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
      />
    );
    items.push(
      <BootstrapPagination.Item 
        key={0} 
        onClick={() => onPageChange(0)}
        active={currentPage === 0}
      >
        1
      </BootstrapPagination.Item>
    );
    if (startPage > 1) {
      items.push(<BootstrapPagination.Ellipsis key="start-ellipsis" />);
    }
  }

  // Page numbers
  for (let page = startPage; page <= endPage; page++) {
    items.push(
      <BootstrapPagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => onPageChange(page)}
      >
        {page + 1}
      </BootstrapPagination.Item>
    );
  }

  // Last page
  if (endPage < totalPages - 1) {
    if (endPage < totalPages - 2) {
      items.push(<BootstrapPagination.Ellipsis key="end-ellipsis" />);
    }
    items.push(
      <BootstrapPagination.Item 
        key={totalPages - 1} 
        onClick={() => onPageChange(totalPages - 1)}
        active={currentPage === totalPages - 1}
      >
        {totalPages}
      </BootstrapPagination.Item>
    );
    items.push(
      <BootstrapPagination.Last 
        key="last" 
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
      />
    );
  }

  return (
    <div className={`d-flex justify-content-center mt-4 ${className}`}>
      <BootstrapPagination size={size}>
        <BootstrapPagination.Prev 
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        />
        {items}
        <BootstrapPagination.Next 
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        />
      </BootstrapPagination>
    </div>
  );
};

export default Pagination;
