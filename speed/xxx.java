public class xxx{
    public static void main(String[] args) {
    
    
            long start=System.currentTimeMillis();
    
            int i, j;
    
            for(i = 0, j = 0; i < 10000000; i++) {
                        j += 1;
                    }
    
            long end=System.currentTimeMillis();
    
            System.out.println((end-start) + "ms");
        }
}

//public class xxx{ 
    //public static void main(String[] args) {  

        //StringBuffer sb = new StringBuffer();
        //long start=System.currentTimeMillis();

        //int i;

        //for(i = 0; i < 10000; i++) {
            //sb.append("1");
        //}

         //sb.toString();
        //long end=System.currentTimeMillis();

        //System.out.println((end-start) + "ms");  
    //}
//}
