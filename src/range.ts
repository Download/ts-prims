/**
 * A union-type approximating the smallest range of positive integer numbers
 * starting at `0` that contains `N`.
 *
 * `N` must be in the range `0..1023` (1K)
 *
 * The resulting range `R` is guaranteed to contain the number `N`, such that
 * the condition `N extends R` always holds.
 *
 * Ideally, this type would always return the rane `0..N-1`, but, due to
 * technical limitations, we can only achieve this for `N < 480`. For
 * `1024 > N >= 480` this type will select the most suitable from a set of
 * pre-defined ranges such that some extra numbers will be included in the
 * resulting range. These numbers are an error, that starts low at ±4 extra
 * numbers on average for numbers close to `480` and ±32 extra numbers for
 * numbers close to `1023`.
 */
export type range<N extends _1K> = (
  N extends _480 ? LessThanEqual<N> :
  N extends _480_487 ? _488 :
  N extends _488_495 ? _496 :
  N extends _496_503 ? _504 :
  N extends _504_512 ? _512 :
  N extends _512_527 ? _528 :
  N extends _528_543 ? _544 :
  N extends _544_559 ? _560 :
  N extends _560_575 ? _576 :
  N extends _576_607 ? _608 :
  N extends _640_671 ? _672 :
  N extends _672_703 ? _704 :
  N extends _704_735 ? _736 :
  N extends _736_767 ? _768 :
  N extends _768_831 ? _832 :
  N extends _832_895 ? _896 :
  N extends _896_959 ? _960 :
  _1K
)

export default range

/**
 * The exact set of positive integer numbers less than `N`. Unsafe version.
 *
 * `N` must be a single literal integer number.
 *
 * The number contained in `N` should be small to prevent deep recursion as
 * this type uses recursion to create the range of all numbers less than `N`.
 * There is no bound on this type preventing recursion issues, which is why it
 * is labeled 'unsafe'. The safe types `LessThan` and `LessThanEqual` have a
 * bound, but creating that bound actually involves recursion...
 */
export type LT<N extends number, A extends number[] = []> =
    N extends A['length'] ?
      A[number] :
      LT<N, [A['length'], ...A]>

/**
* Union-type of the range of positive integer numbers less than `N`.
* `N` must be a single literal integer number less than 480.
*/
export type LessThan<N extends LT<480>, A extends number[] = []> = N extends A['length']
? A[number]
: LessThan<N, [A['length'], ...A]>;

/**
* Union-type of the range of positive integer numbers less than or equal to `N`.
* `N` must be a single literal integer number less than or equal to 256.
*/
export type LessThanEqual<N extends LT<480>> = N | LessThan<N>

// ranges
export type _480 = LT<480>
export type _480_487 =         480 |   481 |   482 |   483 |   484 |   485 |   486 |   487
export type _488 = _480 | _480_487

export type _488_495 =                                                                         488 |   489 |
                               490 |   491 |   492 |   493 |   494 |   495
export type _496 = _488 | _488_495

export type _496_503 =                                                         496 |   497 |   498 |   499 |
                               500 |   501 |   502 |   503
export type _504 = _496 | _496_503

export type _504_512 =                                         504 |   505 |   506 |   507 |   508 |   509 |
                               510 |   511 |   512
export type _512 = _504 | _504_512

export type _512_527 =
                                               512 |   513 |   514 |   515 |   516 |   517 |   518 |   519 |
                               520 |   521 |   522 |   523 |   524 |   525 |   526 |   527
export type _528 = _512 | _512_527

export type _528_543 =
                                                                                               528 |   529 |
                               530 |   531 |   532 |   533 |   534 |   535 |   536 |   537 |   538 |   539 |
                               540 |   541 |   542 |   543
export type _544 = _528 | _528_543

export type _544_559 =
                                                               544 |   545 |   546 |   547 |   548 |   549 |
                               550 |   551 |   552 |   553 |   554 |   555 |   556 |   557 |   558 |   559
export type _560 = _544 | _544_559

export type _560_575 =
                               560 |   561 |   562 |   563 |   564 |   565 |   566 |   567 |   568 |   569 |
                               570 |   571 |   572 |   573 |   574 |   575
export type _576 = _560 | _560_575

export type _576_607 =
                                                                               576 |   577 |   578 |   579 |
                               580 |   581 |   582 |   583 |   584 |   585 |   586 |   587 |   588 |   589 |
                               590 |   591 |   592 |   593 |   594 |   595 |   596 |   597 |   598 |   599 | // ....
                               600 |   601 |   602 |   603 |   604 |   605 |   606 |   607
export type _608 = _576 | _576_607

export type _608_639 =
                                                                                               608 |   609 |
                               610 |   611 |   612 |   613 |   614 |   615 |   616 |   617 |   618 |   619 |
                               620 |   621 |   622 |   623 |   624 |   625 |   626 |   627 |   628 |   629 |
                               630 |   631 |   632 |   633 |   634 |   635 |   636 |   637 |   638 |   639
export type _640 = _608 | _608_639

export type _512_639 = _512_527 | _528_543 | _544_559 | _560_575 | _576_607 | _608_639

export type _640_671 =
                               640 |   641 |   642 |   643 |   644 |   645 |   646 |   647 |   648 |   649 |
                               650 |   651 |   652 |   653 |   654 |   655 |   656 |   657 |   658 |   659 |
                               660 |   661 |   662 |   663 |   664 |   665 |   666 |   667 |   668 |   669 |
                               670 |   671
export type _672 = _640 | _640_671

export type _672_703 =
                                               672 |   673 |   674 |   675 |   676 |   677 |   678 |   679 |
                               680 |   681 |   682 |   683 |   684 |   685 |   686 |   687 |   688 |   689 |
                               690 |   691 |   692 |   693 |   694 |   695 |   696 |   697 |   698 |   699 | // ....
                               700 |   701 |   702 |   703
export type _704 = _672 | _672_703

export type _704_735 =
                                                               704 |   705 |   706 |   707 |   708 |   709 |
                               710 |   711 |   712 |   713 |   714 |   715 |   716 |   717 |   718 |   719 |
                               720 |   721 |   722 |   723 |   724 |   725 |   726 |   727 |   728 |   729 |
                               730 |   731 |   732 |   733 |   734 |   735
export type _736 = _704 | _704_735

export type _736_767 =
                                                                               736 |   737 |   738 |   739 |
                               740 |   741 |   742 |   743 |   744 |   745 |   746 |   747 |   748 |   749 |
                               750 |   751 |   752 |   753 |   754 |   755 |   756 |   757 |   758 |   759 |
                               760 |   761 |   762 |   763 |   764 |   765 |   766 |   767
export type _512_767 = _512_527 | _528_543 | _544_559 | _560_575 | _576_607 | _608_639 | _640_671 | _672_703 | _704_735 | _736_767
export type _768 = _512 | _512_767

export type _768_831 =
                                                                                               768 |   769 |
                               770 |   771 |   772 |   773 |   774 |   775 |   776 |   777 |   778 |   779 |
                               780 |   781 |   782 |   783 |   784 |   785 |   786 |   787 |   788 |   789 |
                               790 |   791 |   792 |   793 |   794 |   795 |   796 |   797 |   798 |   799 | // ....
                               800 |   801 |   802 |   803 |   804 |   805 |   806 |   807 |   808 |   809 |
                               810 |   811 |   812 |   813 |   814 |   815 |   816 |   817 |   818 |   819 |
                               820 |   821 |   822 |   823 |   824 |   825 |   826 |   827 |   828 |   829 |
                               830 |   831
export type _832 = _768 | _768_831

export type _832_895 =
                                               832 |   833 |   834 |   835 |   836 |   837 |   838 |   839 |
                               840 |   841 |   842 |   843 |   844 |   845 |   846 |   847 |   848 |   849 |
                               850 |   851 |   852 |   853 |   854 |   855 |   856 |   857 |   858 |   859 |
                               860 |   861 |   862 |   863 |   864 |   865 |   866 |   867 |   868 |   869 |
                               870 |   871 |   872 |   873 |   874 |   875 |   876 |   877 |   878 |   879 |
                               880 |   881 |   882 |   883 |   884 |   885 |   886 |   887 |   888 |   889 |
                               890 |   891 |   892 |   893 |   894 |   895
export type _896 = _832 | _832_895

export type _896_959 =
                                                                               896 |   897 |   898 |   899 | // ....
                               900 |   901 |   902 |   903 |   904 |   905 |   906 |   907 |   908 |   909 |
                               910 |   911 |   912 |   913 |   914 |   915 |   916 |   917 |   918 |   919 |
                               920 |   921 |   922 |   923 |   924 |   925 |   926 |   927 |   928 |   929 |
                               930 |   931 |   932 |   933 |   934 |   935 |   936 |   937 |   938 |   939 |
                               940 |   941 |   942 |   943 |   944 |   945 |   946 |   947 |   948 |   949 |
                               950 |   951 |   952 |   953 |   954 |   955 |   956 |   957 |   958 |   959
export type _768_959 = _768_831 | _832_895 | _896_959
export type _960 = _896 | _896_959

export type _960_1023 =
                               960 |   961 |   962 |   963 |   964 |   965 |   966 |   967 |   968 |   969 |
                               970 |   971 |   972 |   973 |   974 |   975 |   976 |   977 |   978 |   979 |
                               980 |   981 |   982 |   983 |   984 |   985 |   986 |   987 |   988 |   989 |
                               990 |   991 |   992 |   993 |   994 |   995 |   996 |   997 |   998 |   999 | // ====
                              1000 |  1001 |  1002 |  1003 |  1004 |  1005 |  1006 |  1007 |  1008 |  1009 |
                              1010 |  1011 |  1012 |  1013 |  1014 |  1015 |  1016 |  1017 |  1018 |  1019 |
                              1020 |  1021 |  1022 |  1023
export type _512_1023 = _512_767 | _768_1023
export type _768_1023 = _768_959 | _960_1023
export type _1K = _768 | _768_1023
