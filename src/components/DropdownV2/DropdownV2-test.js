/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  assertMenuOpen,
  assertMenuClosed,
  findMenuItemNode,
  openMenu,
  generateItems,
  generateGenericItem,
} from '../ListBox/test-helpers';
import DropdownV2 from '../DropdownV2';
import DropdownItem from '../DropdownItem';
import DropdownSkeleton from '../DropdownV2/Dropdown.Skeleton';

describe('DropdownV2', () => {
  let mockProps;
  beforeEach(() => {
    mockProps = {
      items: generateItems(5, generateGenericItem),
      onChange: jest.fn(),
      label: 'input',
      placeholder: 'Filter...',
      type: 'default',
    };
  });

  it('should render', () => {
    const wrapper = mount(<DropdownV2 {...mockProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should initially render with the menu not open', () => {
    const wrapper = mount(<DropdownV2 {...mockProps} />);
    assertMenuClosed(wrapper);
  });

  it('should let the user open the menu by clicking on the control', () => {
    const wrapper = mount(<DropdownV2 {...mockProps} />);
    openMenu(wrapper);
    assertMenuOpen(wrapper, mockProps);
  });

  it('should render with strings as items', () => {
    const wrapper = mount(<DropdownV2 {...mockProps} items={['zar', 'doz']} />);
    openMenu(wrapper);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render custom item components', () => {
    const wrapper = mount(<DropdownV2 {...mockProps} />);
    wrapper.setProps({
      itemToElement: item => <div className="mock-item">{item.label}</div>,
    });
    openMenu(wrapper);
    expect(wrapper).toMatchSnapshot();
  });

  describe('title', () => {
    const wrapper = mount(
      <DropdownV2 titleText="Email Input" {...mockProps} />
    );
    const renderedLabel = wrapper.find('label');

    it('renders a title', () => {
      expect(renderedLabel.length).toBe(1);
    });

    it('has the expected classes', () => {
      expect(renderedLabel.hasClass('bx--label')).toEqual(true);
    });

    it('should set title as expected', () => {
      expect(renderedLabel.text()).toEqual('Email Input');
    });
  });

  describe('helper', () => {
    it('renders a helper', () => {
      const wrapper = mount(
        <DropdownV2 helperText="Email Input" {...mockProps} />
      );
      const renderedHelper = wrapper.find('.bx--form__helper-text');
      expect(renderedHelper.length).toEqual(1);
    });

    it('renders children as expected', () => {
      const wrapper = mount(
        <DropdownV2
          helperText={
            <span>
              This helper text has <a href="/">a link</a>.
            </span>
          }
          {...mockProps}
        />
      );
      const renderedHelper = wrapper.find('.bx--form__helper-text');
      expect(renderedHelper.props().children).toEqual(
        <span>
          This helper text has <a href="/">a link</a>.
        </span>
      );
    });

    it('should set helper text as expected', () => {
      const wrapper = mount(<DropdownV2 {...mockProps} />);
      wrapper.setProps({ helperText: 'Helper text' });
      const renderedHelper = wrapper.find('.bx--form__helper-text');
      expect(renderedHelper.text()).toEqual('Helper text');
    });
  });

  it('should render DropdownItem components', () => {
    const wrapper = mount(<DropdownV2 {...mockProps} />);
    wrapper.setProps({
      itemToElement: DropdownItem,
    });
    openMenu(wrapper);
    expect(wrapper).toMatchSnapshot();
  });

  it('should specify light version as expected', () => {
    const wrapper = mount(<DropdownV2 {...mockProps} />);
    expect(wrapper.props().light).toEqual(false);
    wrapper.setProps({ light: true });
    expect(wrapper.props().light).toEqual(true);
  });

  it('should let the user select an option by clicking on the option node', () => {
    const wrapper = mount(<DropdownV2 {...mockProps} />);
    openMenu(wrapper);
    findMenuItemNode(wrapper, 0).simulate('click');
    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onChange).toHaveBeenCalledWith({
      selectedItem: mockProps.items[0],
    });
    assertMenuClosed(wrapper);

    mockProps.onChange.mockClear();

    openMenu(wrapper);
    findMenuItemNode(wrapper, 1).simulate('click');
    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onChange).toHaveBeenCalledWith({
      selectedItem: mockProps.items[1],
    });
  });

  describe('should display initially selected item found in `initialSelectedItem`', () => {
    it('using an object type for the `initialSelectedItem` prop', () => {
      const wrapper = mount(
        <DropdownV2 {...mockProps} initialSelectedItem={mockProps.items[0]} />
      );

      expect(wrapper.find('span.bx--list-box__label').text()).toEqual(
        mockProps.items[0].label
      );
    });

    it('using a string type for the `initialSelectedItem` prop', () => {
      // Replace the 'items' property in mockProps with a list of strings
      mockProps = {
        ...mockProps,
        items: ['1', '2', '3'],
      };

      const wrapper = mount(
        <DropdownV2 {...mockProps} initialSelectedItem={mockProps.items[1]} />
      );

      expect(wrapper.find('span.bx--list-box__label').text()).toEqual(
        mockProps.items[1]
      );
    });
  });
});

describe('DropdownSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<DropdownSkeleton inline />);

    it('Has the expected classes', () => {
      expect(wrapper.hasClass('bx--skeleton')).toEqual(true);
      expect(wrapper.hasClass('bx--dropdown-v2')).toEqual(true);
      expect(wrapper.hasClass('bx--list-box--inline')).toEqual(true);
    });
  });
});
