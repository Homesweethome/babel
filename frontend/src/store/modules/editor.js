import APIEditorServices from "@/services/APIEditorServices";

const state = {
    homeElements: [],
    nodeElements: [],
    selectHomeElement: false,
    selectNode: false,
    selectedNode: {},
    selectedHomeElement: {},
    modeEditor: 'draw', //draw - рисование, select  выбор обьекта для редактирования, searche
    drawTypeElement: 'node',
    floors: [
        {
            title: '1',
            id: 1,
            pathImage: '../../assets/scheme/1.png'
        }
    ],
    selectFloorId: 1,
    searchRoom: [],
    path: {},
}

const getters = {

}

const actions = {
    select_home_element_for_searche({commit}, data){
        commit('SAVE_SEARCHE_HOME_ELEMENT', data)
    },
    async search_path({state, commit}){
        let path = await APIEditorServices.searchePath(
            state.searchRoom[0].id,
            state.searchRoom[1].id
        )
        commit('SAVE_PATH', path)
    },
    set_active_floor({commit, dispatch}, id){
        commit('SAVE_ACTIVE_FLOOR', id)
        dispatch('get_all_nodes')
    },
    add_floor({commit}, data){
        let newFloors = APIEditorServices.addFloors(data)
        commit('SAVE_FLOOR', newFloors)
    },
    async add_image_for_floor({dispatch, state}, data){
         await APIEditorServices.addImageFloor(state.selectFloorId, data)
        dispatch('get_all_floors')

    },
    async get_all_floors({commit, dispatch}){
      let allFloors = await APIEditorServices.getFloors()
      commit('SAVE_FLOORS', allFloors.data)
        dispatch('set_active_floor', allFloors.data[0].id)
    },
    async delete_floor({dispatch,state},id){
        await APIEditorServices.deleteFloor(state.selectFloorId)
        dispatch('get_all_floors')
    },
    async add_home_element({commit, dispatch, state}, data){
        data.floor = state.selectFloorId
        data.type = state.drawTypeElement
        let newElement = {}
        switch (state.drawTypeElement) {
            case 'room' : newElement = await APIEditorServices.setHomeElements(data)
                break;
        }
        dispatch('get_all_home_elements')
        //commit('SAVE_NEW_HOME_ELEMENT', newElement)
    },
    async add_node({dispatch,state}, data) {
        data.floor = state.selectFloorId
        data.type = state.drawTypeElement
        APIEditorServices.addNode(data)
        dispatch('get_all_nodes')
        //commit('SAVE_NEW_NODE', data)
    },
    // update_home_element({commit}, data){
    //
    // },
    // update_node({commit}, data){
    //
    // },
    select_node({commit, dispatch}, data){
        dispatch('unselect_home_element')
        commit('SAVE_SELECTED_NODE', data)
    },
    select_home_element({commit, dispatch}, data){
        dispatch('unselect_node')
        commit('SAVE_SELECTED_HOME_ELEMENT', data)
    },
    async delete_home_element({ dispatch, state}, data){
        const numberHomeElement = state.homeElements.indexOf(data)
        await APIEditorServices.deleteHomeElement(data.id)
        dispatch('get_all_home_elements')
        //commit('DELETE_HOME_ELEMENT', numberHomeElement)
    },
    delete_node({commit}, data){
        const numberNode = state.nodeElements.indexOf(data)
        commit('DELETE_NODE_ELEMENT', numberNode)
    },
    async get_all_home_elements({commit}){
        let homeElement = await APIEditorServices.getAllHomeElements()
        commit('SAVE_HOME_ELEMENTS', homeElement.data)
    },
    async get_all_nodes({commit, state}){
        let nodes = await APIEditorServices.getAllNode(state.selectFloorId)
        commit('SAVE_NODES', nodes.data)
    },
    set_draw_mode_editor({commit}){
        commit('SAVE_EDITOR_MODE', 'draw')
    },
    set_select_mode_editor({commit}){
        commit('SAVE_EDITOR_MODE', 'select')
    },
    set_searche_mode({commit}){
      commit('SAVE_EDITOR_MODE', 'search')
    },
    set_draw_type_element({commit}, typeElement){
        commit('SAVE_DRAW_TYPE_ELEMENT', typeElement)
    },
    unselect_home_element({commit}){
        commit('UNSELECT_HOME_ELEMENT')
    },
    unselect_node({commit}){
        commit('UNSELECT_NODE')
    },
    unselect({commit}){
        commit('UNSELECT')
    }
}


const mutations = {
    SAVE_PATH(state, path){
      state.path = path
    },
    SAVE_SEARCHE_HOME_ELEMENT(state, payload){
        state.searchRoom.push(payload)
        if (state.searchRoom.length>2) {
            state.searchRoom = state.searchRoom.shift()
        }
    },
    SAVE_ACTIVE_FLOOR(state, payload){
        state.selectFloorId = payload
    },
    SAVE_FLOOR(state, payload){
        state.floors.push(payload)
    },
    SAVE_HOME_ELEMENTS(state, payload){
      state.homeElements = payload
    },
    SAVE_NEW_HOME_ELEMENT(state, payload){
        state.homeElements.push(payload)
    },
    SAVE_NEW_NODE(state, payload){
        state.nodeElements.push(payload)
    },
    SAVE_SELECTED_NODE(state, payload){
        state.selectNode = true
        state.selectedNode = payload
    },
    SAVE_SELECTED_HOME_ELEMENT(state, payload) {
        state.selectHomeElement = true
        state.selectedHomeElement = payload
    },
    SAVE_EDITOR_MODE(state, payload){
        state.modeEditor = payload
    },
    SAVE_DRAW_TYPE_ELEMENT(state, payload){
        state.drawTypeElement = payload
    },
    UNSELECT_HOME_ELEMENT(state){
        state.selectedHomeElement = {}
        state.selectHomeElement = false
    },
    UNSELECT_NODE(state){
        state.selectedNode = {}
        state.selectNode = false
    },
    UNSELECT(state){
        state.selectedHomeElement = {}
        state.selectHomeElement = false
        state.selectedNode = {}
        state.selectNode = false
    },
    DELETE_HOME_ELEMENT(state, numberHomeElement){
        state.homeElements.splice(numberHomeElement, 1)
    },
    DELETE_NODE_ELEMENT(state, numberNode){
        state.nodeElements.splice(numberNode, 1)
    },
    SAVE_FLOORS(state, payload){
        state.floors = payload
    },
    SAVE_NODES(state, payload){
        state.nodeElements = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
