<template>
    <div class="product">
        <WHeader></WHeader>
        <div class="container">
            <el-table
                :data="product"
                border
                style="width: 100%">
                <el-table-column
                fixed
                prop="date"
                :label="alias"
                width="150">
                </el-table-column>
                <el-table-column
                prop="name"
                :label="uuid"
                width="120">
                </el-table-column>
                <el-table-column
                prop="province"
                :label="Registration_number"
                width="120">
                </el-table-column>
                <el-table-column
                prop="city"
                :label="last_time"
                width="120">
                </el-table-column>
                <el-table-column
                prop="address"
                :label="remaining"
                width="300">
                </el-table-column>
                <el-table-column
                prop="zip"
                :label="expiration"
                width="120">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small">{{$t('message.register')}}</el-button>
                </template>
                </el-table-column>
            </el-table>           
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../style/product.scss"
</style>

<script >
    import WHeader from './common/WHeader.vue'
    export default{
        data(){
            return{
                alias:this.$t('message.alias'),
                uuid:this.$t('message.uuid'),
                Registration_number:this.$t('message.Registration_number'),
                last_time:this.$t('message.last_time'),
                remaining:this.$t('message.remaining'),
                expiration:this.$t('message.expiration'),
                product:[{
                date: '2016-05-03',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-02',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-04',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-01',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }]
            }
        },
        components:{
            WHeader
        }
    }
</script>