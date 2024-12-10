import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SearchBar from './SearchBar.jsx';

// ==================================================

describe('CompanyCard', () => {
  const mockRetrieveItems = vi.fn();

  beforeEach(() => {
    mockRetrieveItems.mockReset();
  });

  it('renders.', () => {
    render(<SearchBar retrieveItems={mockRetrieveItems} filterName="name" />);
  });

  it('matches snapshot.', () => {
    const { asFragment } = render(
      <SearchBar retrieveItems={mockRetrieveItems} filterName="name" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('can update form data.', () => {
    // Arrange
    const { getByPlaceholderText } = render(
      <SearchBar retrieveItems={mockRetrieveItems} filterName="name" />
    );

    const searchInput = getByPlaceholderText('Enter search term...');

    // Act
    fireEvent.change(searchInput, { target: { value: 'abc' } });

    // Assert
    expect(searchInput).toHaveValue('abc');
    expect(mockRetrieveItems).not.toHaveBeenCalled();
  });

  it.each([
    ['abc', { name: 'abc' }],
    ['', {}],
  ])('can submit form data of "%s".', (name, expectedFilters) => {
    // Arrange
    const { getByPlaceholderText, getByText } = render(
      <SearchBar retrieveItems={mockRetrieveItems} filterName="name" />
    );

    const searchInput = getByPlaceholderText('Enter search term...');
    const submitBtn = getByText('Search');

    fireEvent.change(searchInput, { target: { value: name } });

    // Act
    fireEvent.click(submitBtn);

    // Assert
    expect(mockRetrieveItems).toHaveBeenCalledOnce();
    expect(mockRetrieveItems).toHaveBeenCalledWith(expectedFilters);
  });
});
