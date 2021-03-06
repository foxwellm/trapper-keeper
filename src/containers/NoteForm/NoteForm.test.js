import { NoteForm, mapDispatchToProps } from '../NoteForm/NoteForm'
import React from 'react'
import { shallow } from 'enzyme'

const mockNote = { title: '', id: 1, timestamp: 555 }
const mockProps = {
  postNote: jest.fn(),
  editNote: jest.fn(),
  deleteNote: jest.fn(),
  note: mockNote,
  items: [],
  isEdit: false
}
let shortID = require('short-id')

describe('noteForm', () => {
  let wrapper
  Date.now = jest.fn().mockImplementation(() => 5)
  shortID.generate = jest.fn().mockImplementation(() => 6)

  beforeEach(() => {
    wrapper = shallow(
      <NoteForm {...mockProps} />
    )
  })

  describe('initial state', () => {

    it('should match the initial snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should have initial state', () => {
      const expectedState = {
        note: {
          id: 1,
          timestamp: 555,
          title: ''
        },
        items: [],
        redirect: false,
        errorMessage: ''
      }

      expect(wrapper.state()).toEqual(expectedState)
    })
  })

  describe('handleTitleChange', () => {

    it('should setState of note title as a default', () => {
      const mockEvent = {
        target: {
          value: ''
        }
      }
      const expected = {
        title: '',
        id: 1,
        timestamp: 555,
      }

      wrapper.instance().handleTitleChange(mockEvent)
      expect(wrapper.state('note')).toEqual(expected)
    })

    it('should add a blank item to state if title is not empty', () => {
      const mockEvent = {
        target: {
          value: 'New Title'
        }
      }
      const expected = [{ id: 6, description: '', isCompleted: false, noteID: 1, timestamp: 5 }]

      wrapper.instance().handleTitleChange(mockEvent)
      expect(wrapper.state('items')).toEqual(expected)
    })

    it('should not add an item to state if title is blank', () => {
      const mockEvent = {
        target: {
          value: ''
        }
      }
      const expected = []
      wrapper.instance().handleTitleChange(mockEvent)
      expect(wrapper.state('items')).toEqual(expected)
    })
  })

  describe('handleItemChange', () => {

    it('should setState with item description when new item is added', () => {
      const mockEvent = {
        target: {
          value: 'New Item Description',
          name: 6
        }
      }
      const initialItem = {
        description: '',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }
      const expected = [{
        description: 'New Item Description',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }, {
        description: '',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }]
      wrapper.setState({ items: [initialItem] })
      wrapper.instance().handleItemChange(mockEvent)
      expect(wrapper.state('items')).toEqual(expected)
    })

    it('should not change state if no id is matched', () => {
      const mockEvent = {
        target: {
          value: 'New Item Description',
          name: 99
        }
      }
      const initialItem = [{
        description: '',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }]
      const expected = [{
        description: '',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }]
      wrapper.setState({ items: initialItem })
      wrapper.instance().handleItemChange(mockEvent)
      expect(wrapper.state('items')).toEqual(expected)
    })

    it('should not add more than one new item field at a time', () => {
      const mockEvent = {
        target: {
          value: 'New Item Description',
          name: 99
        }
      }
      const newItem = {
        description: '',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }
      const initialItem = [{
        description: 'need to add new item',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }]
      const expected = [{
        description: 'need to add new item',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }, newItem]
      wrapper.setState({ items: initialItem })
      wrapper.instance().handleItemChange(mockEvent)
      expect(wrapper.state('items')).toEqual(expected)
    })
  })

  describe('toggleComplete', () => {
    it('should toggle item as complete', () => {
      const mockID = 6
      const initialItem = [{
        description: '',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }]
      const expected = [{
        description: '',
        id: 6,
        timestamp: 5,
        isCompleted: true,
        noteID: 1
      }]
      wrapper.setState({ items: initialItem })
      wrapper.instance().toggleComplete(mockID)
      expect(wrapper.state('items')).toEqual(expected)
    })

    it('should not change state if no id is matched', () => {
      const mockID = 99
      const initialItem = [{
        description: '',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }]
      const expected = [{
        description: '',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }]
      wrapper.setState({ items: initialItem })
      wrapper.instance().toggleComplete(mockID)
      expect(wrapper.state('items')).toEqual(expected)
    })
  })

  describe('handleSubmit', () => {
    it('should setState of redirect to true and call postNote when isEdit is false', () => {
      const mockEvent = {
        preventDefault: jest.fn()
      }
      const initialItem = [{
        description: 'not empty',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }]
      wrapper.setState({ note: { title: 'title' }, items: initialItem })

      const expected = true

      wrapper.instance().handleSubmit(mockEvent)
      expect(wrapper.state('redirect')).toEqual(expected)
      expect(wrapper.instance().props.postNote).toHaveBeenCalled()
    })

    it('should setState of redirect to true and call postNote when isEdit is true', () => {
      const mockEvent = {
        preventDefault: jest.fn()
      }
      const initialItem = [{
        description: '',
        id: 6,
        timestamp: 5,
        isCompleted: false,
        noteID: 1
      }]
      wrapper.setState({ note: {title: 'title'}, items: initialItem })
      const expected = true
      wrapper.setProps({ isEdit: true })
      wrapper.instance().handleSubmit(mockEvent)
      expect(wrapper.state('redirect')).toEqual(expected)
      expect(wrapper.instance().props.editNote).toHaveBeenCalled()
    })

    it('should provide an error message when no title is provided', () => {
      const mockEvent = {
        preventDefault: jest.fn()
      }
      const expected = 'Please provide a title'
      
      wrapper.instance().handleSubmit(mockEvent)
      expect(wrapper.state('errorMessage')).toEqual(expected)
    })
  })

  describe('handleDelete', () => {
    it('should setState of redirect to true and call deleteNote', () => {
      const mockNote = {
        title: 'New Title',
        id: 1,
        timestamp: 555
      }
      wrapper.setState({ note: mockNote })

      wrapper.instance().handleDelete()
      expect(wrapper.state('redirect')).toEqual(true)
      expect(wrapper.instance().props.deleteNote).toHaveBeenCalled()

    })
  })

  describe('handleItemDelete', () => {
    it('should setState of redirect to true and call deleteNote', () => {
      const mockID = 1
      const mockItems = [
        {
          description: 'Item 1',
          id: 1,
          timestamp: 5,
          isCompleted: false,
          noteID: 1
        },
        {
          description: 'Item 2',
          id: 2,
          timestamp: 6,
          isCompleted: false,
          noteID: 1
        }
      ]
      const expected = [{
        description: 'Item 2',
        id: 2,
        timestamp: 6,
        isCompleted: false,
        noteID: 1
      }]
      wrapper.setState({ items: mockItems })
      wrapper.instance().handleItemDelete(mockID)
      expect(wrapper.state('items')).toEqual(expected)
    })
  })

  describe('mapStateToProps', () => {

    it('should call dispatch when postNote is called', () => {
      const mockDispatch = jest.fn()
      const mockURL = 'http://localhost:3001/api/v1/notes'

      const mappedProps = mapDispatchToProps(mockDispatch)
      mappedProps.postNote(mockURL, mockNote)
      expect(mockDispatch).toHaveBeenCalled()
    })

    it('should call dispatch when deleteNote is called', () => {
      const mockDispatch = jest.fn()
      const mockURL = 'http://localhost:3001/api/v1/notes'

      const mappedProps = mapDispatchToProps(mockDispatch)
      mappedProps.deleteNote(mockURL, mockNote)
      expect(mockDispatch).toHaveBeenCalled()
    })

    it('should call dispatch when editNote is called', () => {
      const mockDispatch = jest.fn()
      const mockURL = 'http://localhost:3001/api/v1/notes'

      const mappedProps = mapDispatchToProps(mockDispatch)
      mappedProps.editNote(mockURL, mockNote)
      expect(mockDispatch).toHaveBeenCalled()
    })
  })

})